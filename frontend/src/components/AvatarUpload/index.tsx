import * as React from 'react';
import { connect } from 'react-redux';

import { setAuthUser } from '../../actions';
import { User } from '../../meta/types/User';
import { ImagesApi } from '../../services';
import ActionButton from '../common/ActionButton';
import Dropzone from '../common/Dropzone';
import GalleryImage from '../Gallery/GalleryImage';

type Props = { setAuthUser: (user: User) => void; authUser: User };
type State = { uploading: boolean };

class AvatarUpload extends React.Component<Props, State> {
  state = { uploading: false };

  handleAcceptedFiles = async (accepted: File[]) => {
    const file = accepted[0];
    this.setState({ uploading: true });

    const resp = await ImagesApi.upload_image_file({ file, avatar: true }, true);
    this.props.setAuthUser({ ...this.props.authUser, avatar: resp.image_url });
    this.setState({ uploading: false });
  };

  renderDropzone = () => {
    const { uploading } = this.state;
    return <ActionButton icon="upload" content="Upload new avatar" loading={uploading} />;
  };

  render() {
    const {
      authUser: { avatar },
    } = this.props;
    const { uploading } = this.state;
    const src = avatar || '';

    return (
      <React.Fragment>
        {!uploading && <GalleryImage src={src} style={{ marginBottom: '10px' }} />}

        <Dropzone
          multiple={false}
          handleAcceptedFiles={this.handleAcceptedFiles}
          renderDropzone={this.renderDropzone}
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  setAuthUser,
};

export default connect(
  null,
  mapDispatchToProps,
)(AvatarUpload);
