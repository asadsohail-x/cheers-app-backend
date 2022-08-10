export const userAggregate = [
  // Join with Genders Collection
  {
    $lookup: {
      from: "genders",
      localField: "genderId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      as: "gender",
    },
  },
  // Join with Professions Collection
  {
    $lookup: {
      from: "professions",
      localField: "professionId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      as: "profession",
    },
  },
  // Removing fields
  {
    $unset: ["genderId", "professionId", "password"],
  },
  // Destructure gender array
  {
    $unwind: "$gender",
  },
  // Destructure profession array
  {
    $unwind: "$profession",
  },
];
export const swipeAggregate = [
  {
    $lookup: {
      from: "users",
      localField: "swiperId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "swiper",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "swipedId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "swiped",
    },
  },
  {
    $unset: ["swiperId", "swipedId"],
  },
  {
    $unwind: "$swiper",
  },
  {
    $unwind: "$swiped",
  },
];
export const callLogAggregate = [
  {
    $lookup: {
      from: "users",
      localField: "callerId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "caller",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "receiverId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "receiver",
    },
  },
  {
    $unset: ["callerId", "receiverId"],
  },
  {
    $unwind: "$caller",
  },
  {
    $unwind: "$receiver",
  },
];
