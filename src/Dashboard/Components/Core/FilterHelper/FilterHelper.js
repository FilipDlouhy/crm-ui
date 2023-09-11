export const addSelectedFilterSort = (
  sortArray = [],
  { filterName, ascending }
) => {
  let valueChangeObject; // Initialize a variable to hold the object to be updated
  let exists; // Initialize a variable to check if the object already exists
  // Loop through the selectedFiltersSortRole array to find the object
  for (const filter of sortArray) {
    if (filter.filterName === filterName) {
      exists = true;
      valueChangeObject = filter;
      break;
    }
  }

  // If the object doesn't exist, add it to the selectedFiltersSortRole array
  if (!exists) {
    sortArray.push({
      filterName,
      ascending,
    });
  }

  // If the object exists and the value needs to be changed
  if (exists && valueChangeObject.ascending !== ascending) {
    // Find the index of the object to delete based on filterName
    const indexToDelete = sortArray.findIndex(
      (filter) => filter.filterName === filterName
    );

    // Remove the existing object from the selectedFiltersSortRole array
    sortArray.splice(indexToDelete, 1);

    // Push a new object with the updated filterValue
    sortArray.push({
      filterName,
      ascending,
    });
  }

  return sortArray;
};

export const removeSelectedFilter = (sortArray, filterName) => {
  sortArray = sortArray.filter((filter) => filter.filterName !== filterName);
  return sortArray;
};

export const addSelectedFilter = (filterArray, { filterName, filterValue }) => {
  let valueChangeObject; // Initialize a variable to hold the object to be updated
  let exists; // Initialize a variable to check if the object already exists
  // Loop through the selectedFiltersUser array to find the object
  for (const filter of filterArray) {
    if (filter.filterName === filterName) {
      exists = true;
      valueChangeObject = filter;
      break;
    }
  }

  // If the object doesn't exist, add it to the selectedFiltersUser array
  if (!exists) {
    filterArray.push({ filterName, filterValue });
  }

  // If the object exists and the value needs to be changed
  if (exists && valueChangeObject.filterValue !== filterValue) {
    // Find the index of the object to delete based on filterName
    const indexToDelete = filterArray.findIndex(
      (filter) => filter.filterName === filterName
    );

    // Remove the existing object from the selectedFiltersRole array
    filterArray.splice(indexToDelete, 1);

    // Push a new object with the updated filterValue
    filterArray.push({ filterName, filterValue });
  }

  return filterArray;
};
