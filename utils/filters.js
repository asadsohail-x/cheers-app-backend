const getFilterPipeline = (params = [], args = []) => [
  {
    $addFields: {
      matchedFilters: {
        $size: {
          $setIntersection: [params, args],
        },
      },
    },
  },
  {
    $sort: {
      matchedFilters: -1,
    },
  },
];

const queryToArgs = (query) => {
  return {
    params: [...Object.keys(query).map((key) => `$${key}`)],
    args: [...Object.values(query)],
  };
};

const filter = async (collection, query) => {
  const { params, args } = queryToArgs(query);

  const filterPipeline = getFilterPipeline(params, args);
  return await collection.aggregate(filterPipeline);
};

exports.getFilterPipeline = getFilterPipeline;
exports.queryToArgs = queryToArgs;
exports.filter = filter;
