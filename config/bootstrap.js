module.exports.bootstrap = async function () {

  var numRecords = await Serie.count(criteria);
  if (count > 0) { return };

  return Serie.createEach([
    {
      _id: "1",
      title: "Sacketts",
      totalCount: "18"
    },
    {
      _id: "2",
      title: "Stopy",
      totalCount: "130"
    },
    {
      _id: "3",
      title: "Western",
      totalCount: "14"
    },
    {
      _id: "4",
      title: "Hulánova láska",
      totalCount: "5"
    },
    {
      _id: "5",
      title: "Theodore Boone",
      totalCount: "4"
    },
    {
      _id: "6",
      title: "Millennium",
      totalCount: "5"
    },
    {
      _id: "7",
      title: "V tieni padišaha",
      totalCount: "6"
    }
  ]);


};
