/* eslint-disable import/no-extraneous-dependencies */
import datauri from 'datauri/sync';

const fileRegex = /\.(png|ico|jpg|svg|wav)$/;

export default () => ({
  name: 'image',
  transform: (_src, id) => fileRegex.test(id) && {
    map: null,
    code: `export default '${datauri(id).content}';`,
  },
});
