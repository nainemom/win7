import datauri from 'datauri';
const fileRegex = /\.(png|ico|jpg|svg|wav)$/;


export default () => ({
  name: 'image',
  transform(_src, id) {
    if (fileRegex.test(id)) {
      return datauri(id).then((data) => ({
        map: null,
        code: `export default '${data}';`,
      }));
    }
  }
});
