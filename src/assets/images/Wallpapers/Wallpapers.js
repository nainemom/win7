import a1 from './1.jpg?url';
import a2 from './2.jpg?url';
import a3 from './3.jpg?url';
import a4 from './4.jpg?url';
import a5 from './5.jpg?url';
import a6 from './6.jpg?url';
import a7 from './7.jpg?url';
import a8 from './8.jpg?url';
import a9 from './9.jpg?url';
import a10 from './10.jpg?url';
import a11 from './11.jpg?url';
import a12 from './12.jpg?url';
import a13 from './13.jpg?url';
import a14 from './14.jpg?url';

export async function getWallpapersList() {
  //todo use a dynamic way to import wallpapers
  const list = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14];
  return list;
}
