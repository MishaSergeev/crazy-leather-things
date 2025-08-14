export function searchItem(item, searchText = '') {
    if (!searchText) return true;
    const lower = searchText.toLocaleLowerCase();
    return (
        item.description?.toLocaleLowerCase().includes(lower) ||
        item.description_full?.toLocaleLowerCase().includes(lower)
    );
}

export function filterItem(item, category, defaultCategory, categoriesList) {
    if (!category || category === defaultCategory || category === categoriesList) {
        return true;
    }
    return item.category === category;
}
