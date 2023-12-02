


export const LoadQueryFromCache = async (query, object) => {
    var cachedQuery = await localStorage.getItem("queryCache");
    cachedQuery = JSON.parse(cachedQuery)

    if (cachedQuery == null || cachedQuery == undefined) {
        cachedQuery = {}
    }

    if (cachedQuery[`${query}${object}`] == null) {
        cachedQuery[`${query}${object}`] = JSON.stringify({data:"[]"})
    }

    var obj = JSON.parse(cachedQuery[`${query}${object}`])
    obj['data'] = JSON.parse(obj['data'])

    return obj
}

export const SetQueryToStorage = async (query, object, responseData) => {
    var cachedQueries = await localStorage.getItem("queryCache");
    cachedQueries = JSON.parse(cachedQueries)

    if (cachedQueries == null || cachedQueries == undefined) {
        cachedQueries = {}
    }

    if (cachedQueries[`${query}${object}`] == null) {
        cachedQueries[`${query}${object}`] = JSON.stringify({data:"[]"})
    }

    cachedQueries[`${query}${object}`] = JSON.parse(cachedQueries[`${query}${object}`])

    cachedQueries[`${query}${object}`]['data'] = JSON.stringify(responseData)
    cachedQueries[`${query}${object}`]['requestDate'] = JSON.stringify(Date.now())
    cachedQueries[`${query}${object}`] = JSON.stringify(cachedQueries[`${query}${object}`])
    await localStorage.setItem("queryCache", JSON.stringify(cachedQueries));
}