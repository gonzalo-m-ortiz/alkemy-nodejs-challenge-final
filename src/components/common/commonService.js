// Receive the Model, and the ids: int[] or int.
// if the Model DOESN'T HAVE 'id' column, provide a third parameter with the name of a valid column
// Returns [err, data]
//      err = null | int --> entityId that doesn't exist
//      data = null | true --> entities exist
const entitiesExist = async (Model, entitiesIds, attribute = 'id') => {
    // validate in function that called this

    // check if entities exists
    if (Array.isArray(entitiesIds)) {
        for (const entityId of entitiesIds) {
            const idEntity = await Model.findByPk(entityId, { attributes: [attribute] });
            if (!idEntity)
                return [entityId, null];
        }
    } else {
        const entityId = await Model.findByPk(entitiesIds, { attributes: [attribute] });
        if (!entityId) 
            return [entitiesIds, null];
    }

    return [null, true]; // all ok
}

module.exports = {
    entitiesExist,
};
