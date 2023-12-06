export function validateArticleChanges(reqBody) {
    const { title: newTitle, subtitle: newSubtitle, description: newDescription, category: newCategory } = reqBody;
    const updateData = {
        title: newTitle,
        subtitle: newSubtitle,
        description: newDescription,
        category: newCategory,
        updatedAt: Date.now()
    }
    for (let key in updateData) {
        if (updateData[key] == null) {
            delete updateData[key];
        }
    }
    return updateData;
}

