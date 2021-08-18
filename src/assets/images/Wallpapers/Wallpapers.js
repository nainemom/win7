export async function getWallpapersList() {
  const list = [];
  for (let i = 1; i < 15; i++) {
    list.push(import('./' + i + '.jpg?url'));
  }
  return (await Promise.all(list)).map(it => it.default);
}
