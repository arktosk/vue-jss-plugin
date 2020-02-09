/**
 * Merge created class names into same reference that will be passed to the component.
 * @param {Record<string, string>} staticStyleSheetClasses - Class names map for static style sheet.
 * @param {Record<string, string>} dynamicStyleSheetClasses - Class names map for dynamic style sheet.
 * @return {Record<string, string>} - Merged map of every created class name.
 */
export const mergeStyleSheetClasses = (staticStyleSheetClasses, dynamicStyleSheetClasses) => {
  if (!dynamicStyleSheetClasses) return {...staticStyleSheetClasses};

  // Assign reactive classes into static ones
  return Object.keys(dynamicStyleSheetClasses).reduce((classes, rule) => {
    if (!classes[rule]) {
      classes[rule] = dynamicStyleSheetClasses[rule];
    } else {
      classes[rule] = [
        ...(Array.isArray(classes[rule]) ? classes[rule] : [classes[rule]]),
        dynamicStyleSheetClasses[rule],
      ];
    }

    return classes;
  }, {...staticStyleSheetClasses});
};
