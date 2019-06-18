import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { logoutThunk } from '../../redux/modules/auth';
import localization from '../../lib/localization';
import './app-login-dialog.scss';

export class LoginDialogPure extends React.Component {
  componentWillMount() {
    const { loggedOut, dispatch } = this.props;
    if (loggedOut) {
      axios
        .get('/logout')
        .then(() => {
          dispatch(logoutThunk());
        })
        .catch(() => {
          dispatch(logoutThunk());
        });
    }
  }

  render() {
    const { loggedOut } = this.props;
    return (
      <div className="login-dialog-wrapper p-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="col-12 col-md-8">
                {loggedOut && (
                  <div
                    className="mt-2 alert alert-warning fdk-text-size-small fdk-color1"
                    role="alert"
                  >
                    <span>
                      <strong>
                        {localization.loginDialog.loggedOutMsgPart1}
                      </strong>
                    </span>
                    <span>{localization.loginDialog.loggedOutMsgPart2}</span>
                  </div>
                )}
                {!loggedOut && (
                  <div>
                    <h1 className="fdk-text-extra-strong mb-md-5">
                      {localization.loginDialog.title}
                    </h1>
                    <div className="fdk-text-size-medium fdk-text-line-medium mt-2 mb-md-3">
                      {localization.loginDialog.ingress}
                    </div>
                  </div>
                )}
                <div className="mt-5 mb-5">
                  <a className="fdk-button fdk-button-cta" href="/login">
                    {localization.app.logIn}
                  </a>
                </div>
                <div className="fdk-text-size-small fdk-text-line-medium">
                  <strong>
                    {localization.catalogs.missingCatalogs.accessTitle}
                  </strong>
                  <p>
                    <a href="https://fellesdatakatalog.brreg.no/about-registration">
                      {localization.catalogs.missingCatalogs.accessText}
                      <i className="fa fa-external-link fdk-fa-right" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginDialogPure.defaultProps = {
  loggedOut: false
};

LoginDialogPure.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loggedOut: PropTypes.bool
};

function mapStateToProps({ user }) {
  const { userItem, isFetchingUser } = user || {
    userItem: null,
    isFetchingUser: false
  };
  return {
    userItem,
    isFetchingUser
  };
}

export const LoginDialog = connect(mapStateToProps)(LoginDialogPure);
