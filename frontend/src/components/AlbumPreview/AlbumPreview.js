// @flow
import React from 'react';
import GalleryImage from '../Gallery/GalleryImage';
import styled from 'styled-components';
import { toReadableAlbumDate } from '../../lib/date';
import { ALBUMS_IMAGE_WIDTH } from '../../constants/gallerySizes';
import type { Album } from '../../meta/types/Album';

type Props = { album: Album, onAlbumClick: Function };
type State = {};

class AlbumPreview extends React.Component<Props, State> {
  render() {
    const { onAlbumClick, album } = this.props;

    const image_url = album.images.length > 0 ? album.images[0].image_url : null;

    return (
      <AlbumPreviewStyle onClick={onAlbumClick} className="AlbumPreview">
        <GalleryImage
          src={image_url}
          style={{ objectFit: 'cover' }}
          width="100%"
          height={ALBUMS_IMAGE_WIDTH}
        />
        <div
          style={{
            position: 'absolute',
            fontSize: '0.8rem',
            bottom: '0px',
            color: 'white',
            padding: '4px',
            width: '100%',
            zIndex: 100,
            background: 'linear-gradient(rgba(0, 0, 0, .55), rgba(0, 0, 0, .55))',
          }}
        >
          <div style={{ color: 'white', fontWeight: 900 }}>{album.name}</div>
          <div style={{ color: 'white', fontWeight: 900 }}>
            {album.images_count} images · {toReadableAlbumDate(album.uploaded_at)}
          </div>
        </div>
      </AlbumPreviewStyle>
    );
  }
}

const AlbumPreviewStyle = styled.div`
  position: relative;
  :hover {
    cursor: pointer;
  }
`;

export default AlbumPreview;
