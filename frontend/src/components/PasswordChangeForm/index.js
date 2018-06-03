import PasswordChangeForm from './PasswordChangeForm';
import { UserAuthApi } from '../../services';
import { withFormik } from 'formik';
import { connect } from 'react-redux';
import { logout } from '../../actions';

const mapDispatchToProps = {
  logout,
};

const PasswordChangeFormContainer = withFormik({
  mapPropsToValues: () => {
    return { old_password: '', new_password2: '', new_password1: '' };
  },
  validateOnChange: false,

  validate: (values, props) => {
    const errors = {};

    if (values.old_password === values.new_password1) {
      errors.new_password1 = ['New password is same'];
    }
    return errors;
  },

  handleSubmit: (values, { props, setSubmitting, setErrors }) => {
    UserAuthApi.changePassword(values)
      .then(resp => {
        props.logout();
      })
      .catch(err => {
        setSubmitting(false);
        setErrors(err.body);
      });
  },
})(PasswordChangeForm);

export default connect(
  null,
  mapDispatchToProps,
)(PasswordChangeFormContainer);