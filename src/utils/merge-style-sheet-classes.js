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
