import React from 'react';
import InputField from '../../common/components/InputField';
import CheckBox from '../../common/components/CheckBox';

export default class ConfirmEmailAddressForm extends React.Component {
    render() {
        return (
            <div>
            <h2 className="modal-title">
            {this.props.config.strings.confirmEmailLabel}
    </h2>
        <div className="modal-body">
            <div>
            <div className="modal-body-content">
            <span>{this.props.config.strings.confirmEmailDescription}</span>
        <br/>
        <br/>
        {this.props.config.strings.currentEmailAddressLabel}
    <br/><br/>
        {this.props.primaryEmail}
    </div>
        </div>
        </div>
        <div className="modal-footer">
            <button className="btn btn-primary col-xs-5"
        onClick={this.props.handlers.confirmEmailAddressBtnHandler}>{this.props.config.strings.confirmBtnLabel}</button>
        <button className="btn btn-secondary col-xs-3"
        onClick={this.props.handlers.changeEmailAddressBtnHandler}>{this.props.config.strings.changeBtnLabel}</button>
        {this.props.saving?
    <div className="message col-xs-3">
            <img src="https://resource.qal1.digitalinsight.com/leapfrog/1.0/img/loader.gif"/>
            <span className="message">{this.props.config.strings.loaderText}</span>
        </div>:
        null}
    </div>
        </div>
    );
    }
}