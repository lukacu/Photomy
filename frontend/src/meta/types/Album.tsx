import { Image, ImageMatch, mapImages } from './Image';

export type ServerAlbum = {
  uploaded_at: string;
  images: (ImageMatch | Image)[];
  name: string;
  id: string;
  images_count: number;
  cover_image_url: string;
  albumName: string;
  image_id: string;
};

export type Album = {
  uploaded_at: Date;
  images: (ImageMatch | Image)[];
  name: string;
  id: string;
  images_count: number;
  cover_image_url: string;
  albumName: string;
  image_id: string;
};

export const mapAlbums = (albums: ServerAlbum[]): Album[] => {
  return albums.map(mapAlbum);
};

export const mapAlbum = (album: ServerAlbum): Album => {
  return {
    ...album,
    uploaded_at: new Date(album.uploaded_at),
    images: mapImages(album.images),
  };
};

export const filterAlbum = (albums: Album[], albumId: string) => {
  return albums.filter(album => album.id !== albumId);
};

export const renameAlbumInCollection = (albums: Album[], newAlbum: Album) => {
  return albums.map(album => (newAlbum.id === album.id ? { ...album, ...newAlbum } : album));
};

export const updateAlbumCoverImageUrlInCollection = (
  albums: Album[],
  albumId: string,
  cover_image_url: string,
) => {
  return albums.map(album => (album.id === albumId ? { ...album, cover_image_url } : album));
};

export const addImageToAlbum = (album: Album, image: Image) => {
  const baseImages = album.images || [];
  const baseCount = album.images_count || 0;
  return {
    ...album,
    images: [...baseImages, image],
    images_count: baseCount + 1,
  };
};

export const addImageToAlbumFromCollection = (
  albums: Album[],
  selectedAlbum: Album,
  image: Image,
) => {
  return albums.map(
    album => (album.id === selectedAlbum.id ? addImageToAlbum(album, image) : album),
  );
};

export const filterImageFromAlbumPhotos = (album: Album, imageId: string) => {
  const albumImages = album.images || [];
  return albumImages.filter(image => image.image_id !== imageId);
};

export const removeImageFromAlbumsCollection = (
  albums: Album[],
  imageId: string,
  albumId: string,
) => {
  return albums.map(album => {
    if (album.id === albumId) {
      const currentCount = album.images_count || 1;
      return {
        ...album,
        images: filterImageFromAlbumPhotos(album, imageId),
        images_count: currentCount - 1,
      };
    }
    return album;
  });
};

export const addImageToAlbumCollection = (albums: Album[], selectedAlbum: Album, image: Image) => {
  return albums.map(
    album => (album.id === selectedAlbum.id ? addImageToAlbum(album, image) : album),
  );
};

export const setCoverImageUrlToAlbumCollection = (
  albums: Album[],
  albumId: string,
  cover_image_url: string,
) => {
  return albums.map(album => (album.id === albumId ? { ...album, cover_image_url } : album));
};

export const getCoverUrl = (album: Album) => {
  return album.cover_image_url
    ? album.cover_image_url
    : album.images && album.images.length > 0
      ? album.images[0].image_url
      : null;
};

export const withImage = (album: Album, image: Image) => {
  const updatedImages = [...album.images, image];
  const updatedAlbum = {
    ...album,
    images: updatedImages,
    images_count: updatedImages.length,
  };
  if (!updatedAlbum.cover_image_url) {
    updatedAlbum.cover_image_url = image.image_url;
  }
  return updatedAlbum;
};

export const displayAlbumName = (album: Album) => {
  return album.name || 'Untitled album';
};
