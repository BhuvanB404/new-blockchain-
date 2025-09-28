// Transforms server FHIR-like Bundle for batch details into a flat UI-friendly object
export function normalizeBatchDetails(data) {
  if (!data) return null;

  // If it's already in expected flat shape, return as-is
  if (data.batchId || data.herbName || data.farmLocation) {
    return data;
  }

  // Expecting a FHIR Bundle with Specimen and possibly Provenance entries
  try {
    const result = {
      batchId: undefined,
      herbName: undefined,
      scientificName: undefined,
      harvestDate: undefined,
      farmLocation: undefined,
      quantity: undefined,
      unit: undefined,
      cultivationMethod: undefined,
      harvestMethod: undefined,
      plantPart: undefined,
      gpsCoordinates: undefined,
      environmentalData: undefined,
      qualityTests: [],
      processingSteps: []
    };

    // Find Specimen (primary batch record)
    const entries = Array.isArray(data.entry) ? data.entry : [];
    const specimenEntry = entries.find(e => e.resource && e.resource.resourceType === 'Specimen');
    const provenanceEntries = entries.filter(e => e.resource && e.resource.resourceType === 'Provenance');

    if (specimenEntry) {
      const sp = specimenEntry.resource;
      result.batchId = sp.id || (sp.identifier && sp.identifier[0]?.value) || data.id;

      // herbName and scientific
      if (sp.type?.text) {
        // e.g., "Ashwagandha (Withania somnifera)"
        const text = sp.type.text;
        const match = text.match(/^(.*)\s*\((.*)\)\s*$/);
        if (match) {
          result.herbName = match[1].trim();
          result.scientificName = match[2].trim();
        } else {
          result.herbName = text;
        }
      }

      // quantity and unit
      if (sp.collection?.quantity) {
        result.quantity = sp.collection.quantity.value;
        result.unit = sp.collection.quantity.unit;
      }

      result.harvestDate = sp.collection?.collectedDateTime;
      result.harvestMethod = sp.collection?.method?.text;
      result.plantPart = sp.collection?.bodySite?.text;

      // farm location
      result.farmLocation = sp.subject?.display || sp.subject?.reference;

      // extensions for cultivation, environment, and images
      const ext = Array.isArray(sp.extension) ? sp.extension : [];
      const cultivation = ext.find(x => x.url === 'cultivation-method');
      if (cultivation?.valueString) result.cultivationMethod = cultivation.valueString;
      const env = ext.find(x => x.url === 'environmental-data');
      if (env?.valueString) {
        try { result.environmentalData = JSON.parse(env.valueString); } catch { result.environmentalData = { raw: env.valueString }; }
      }
      const imagesExt = ext.find(x => x.url === 'images');
      if (imagesExt?.valueString) {
        try { result.images = JSON.parse(imagesExt.valueString); } catch { result.images = []; }
      }
    }

    // GPS and initial provenance info
    for (const pe of provenanceEntries) {
      const prov = pe.resource;
      const locExt = prov.location?.extension || [];
      const gps = locExt.find(x => x.url === 'gps-coordinates');
      if (!result.gpsCoordinates && gps?.valueString) {
        try { result.gpsCoordinates = JSON.parse(gps.valueString); } catch { /* ignore */ }
      }
      if (Array.isArray(prov.activity?.coding) && prov.occurredDateTime && prov.activity.coding[0]) {
        const activity = prov.activity.coding[0];
        if ((activity.code === 'COLLECT') || /collect/i.test(activity.display || '')) {
          result.processingSteps.push({
            processingType: activity.display || activity.code,
            processingDate: prov.occurredDateTime,
            processingLocation: prov.location?.reference,
          });
        }
      }
    }

    // Also check Specimen.processing array for initial processing meta
    if (specimenEntry?.resource?.processing) {
      const processing = specimenEntry.resource.processing;
      const arr = Array.isArray(processing) ? processing : [processing];
      for (const p of arr) {
        result.processingSteps.push({
          processingType: p.description || 'Processing',
          processingDate: p.timeDateTime,
          processingLocation: result.farmLocation,
        });
      }
    }

    // Map Observations (quality tests)
    for (const e of entries) {
      const r = e.resource;
      if (r?.resourceType === 'Observation') {
        const testType = r.code?.text || r.code?.coding?.[0]?.display || r.code?.coding?.[0]?.code;
        const testStatus = r.valueCodeableConcept?.coding?.[0]?.code || r.valueCodeableConcept?.coding?.[0]?.display;
        const testDate = r.effectiveDateTime || r.issued;
        const certificationExt = (r.extension || []).find(x => x.url === 'certification');
        let certification = certificationExt?.valueString;
        if (typeof certification === 'string' && /^".*"$/.test(certification)) {
          try { certification = JSON.parse(certification); } catch { /* keep as is */ }
        }
        const testImagesExt = (r.extension || []).find(x => x.url === 'test-images');
        let testImages;
        if (testImagesExt?.valueString) {
          try { testImages = JSON.parse(testImagesExt.valueString); } catch { testImages = []; }
        }
        const reportUrlExt = (r.extension || []).find(x => x.url === 'report-url');
        const reportUrl = reportUrlExt?.valueString || reportUrlExt?.valueUri || undefined;
        // labId from performer
        let labId;
        const performerRef = r.performer?.[0]?.reference || r.performer?.[0]?.onBehalfOf?.reference;
        const performerDisp = r.performer?.[0]?.display;
        if (performerRef) {
          const parts = performerRef.split('/');
          labId = parts[1] || performerRef;
        } else if (performerDisp) {
          const m = performerDisp.match(/laboratory_[A-Za-z0-9_\-]+/i);
          if (m) labId = m[0];
        }
        // Reconstruct results: prefer component pairs if present
        let testResults = undefined;
        if (Array.isArray(r.component) && r.component.length > 0) {
          // If components look like character stream (numeric keys with single-char values), collapse into a summary
          const numericParts = r.component.every(c => /^\d+$/.test((c.code?.text || '').toString()))
          const charParts = r.component.every(c => (c.valueQuantity?.value || '').toString().length === 1)
          if (numericParts && charParts) {
            const sorted = [...r.component].sort((a, b) => parseInt(a.code.text) - parseInt(b.code.text))
            const summary = sorted.map(c => (c.valueQuantity?.value || '').toString()).join('')
            testResults = { summary }
          } else {
            testResults = {}
            for (const c of r.component) {
              const key = (c.code?.text || '').toString()
              const val = c.valueQuantity?.value ?? c.valueString ?? c.valueCodeableConcept?.text
              if (key) testResults[key] = val
            }
          }
        }
        result.qualityTests.push({
          batchId: result.batchId,
          labId,
          testType,
          testStatus,
          testDate,
          testMethod: r.method?.text,
          equipmentUsed: r.device?.display,
          certification,
          images: testImages,
          reportUrl,
          observations: r.note?.[0]?.text,
          testResults
        });
      }
      // Map Procedures (manufacturer processing)
      if (r?.resourceType === 'Procedure') {
        const processingType = r.code?.text || r.code?.coding?.[0]?.display || 'Processing';
        const processingDate = r.performedDateTime;
        const processingLocation = r.location?.reference;
        let additional = undefined;
        const ext = Array.isArray(r.extension) ? r.extension : [];
        const pdetails = ext.find(x => x.url === 'processing-details');
        if (pdetails?.valueString) {
          try { additional = JSON.parse(pdetails.valueString); } catch { additional = { raw: pdetails.valueString }; }
        }
        result.processingSteps.push({
          batchId: result.batchId,
          processingType,
          processingDate,
          processingLocation,
          processingDetails: additional,
          // Map common fields to processingConditions so UI renders temperature/duration
          processingConditions: additional && (additional.temperature || additional.duration) ? {
            temperature: additional.temperature,
            duration: additional.duration,
          } : undefined,
          inputQuantity: additional?.inputQuantity,
          outputQuantity: additional?.outputQuantity,
          equipmentUsed: r.usedReference?.[0]?.display,
        });
      }
    }

    return result;
  } catch (e) {
    // On any parsing issue, return original so UI at least can render something
    return data;
  }
}
