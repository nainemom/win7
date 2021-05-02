import datauri from 'datauri/sync';
const fileRegex = /\.(png|ico|jpg|svg|wav)$/;


export default () => ({
  name: 'image',
  transform(_src, id) {
    if (fileRegex.test(id)) {
      return {
        map: null,
        code: `export default '${datauri(id).content}';`,
      };
    }
  }
});
