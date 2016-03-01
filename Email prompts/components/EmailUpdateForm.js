import React from 'react';
import InputField from '../../common/components/InputField';
import CheckBox from '../../common/components/CheckBox';

export default class EmailUpdateForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.handlers.onFormSubmit}>
    <h2 className="modal-title">{this.props.config.isOOSyncEmail ? this.props.config.strings.outOfSyncEmailTitle : this.props.config.strings.badEmailTitle }</h2>
        <div className="modal-body">
            <div className="form modal-body-content">
            { !this.props.config.isOOSyncEmail ?
    <div>
        <div>
        <span>{this.props.config.strings.badEmailDescription}</span>
        </div>
        <br />
        </div>
    : '' }
    <div className="row form-group">
            <InputField id="primaryEmail" name="primaryEmail" className="col-xs-12" isInvalid={this.props.isPrimaryEmailInvalid} focusOnInit={true}
        label={this.props.config.isOOSyncEmail === true?
            this.props.config.strings.newEmailLabel:
            this.props.config.strings.primaryEmailLabel}
        labelClassName="col-sm-5"
        value={this.props.primaryEmail}
        isValid={this.props.primaryEmailIsValid}
        validationError={this.props.primaryEmailErrorMessage}
        onChange={this.props.handlers.primaryEmailChangeHandler}
        onBlur={this.props.handlers.primaryEmailBlurHandler}/>
    </div>
        <div className="row form-group">
            <InputField id="confirmEmail" name="confirmEmail" className="col-xs-12"
        label={this.props.config.strings.confirmEmailLabel}
        labelClassName="col-sm-5"
        value={this.props.confirmEmail}
        isValid={this.props.confirmEmailIsValid}
        validationError={this.props.confirmEmailErrorMessage}
        onChange={this.props.handlers.confirmEmailChangeHandler}
        onBlur={this.props.handlers.confirmEmailBlurHandler}/>

    </div>
        { this.props.config.bpEmailEnabled ?
    <div className="form-group">
            <div className="row form-group">
            <CheckBox name="useSameEmail" label={this.props.config.strings.useSameEmailMessage} className="col-xs-12"
        checked={this.props.useSameEmail}
        onChange={this.props.handlers.useSameEmailToggleHandler}/>
    </div>
        <div className={'row form-group ' + (this.props.useSameEmail ? 'hide' : 'show')}>
            <InputField id="billPayEmail" name="billPayEmail" className="col-xs-12"
        label={this.props.config.strings.bpEmailLabel}
        labelClassName="col-sm-5"
        value={this.props.useSameEmail ? this.props.primaryEmail : this.props.billPayEmail}
        placeholder={this.props.config.strings.bpEmailPlaceholder}
        isValid={this.props.billPayEmailIsValid}
        validationError={this.props.billPayEmailErrorMessage}
        onChange={this.props.handlers.bpEmailChangeHandler}
        onBlur={this.props.handlers.bpEmailBlurHandler}/>
    </div>
        </div>
    :''}
    </div>
        </div>
        <div className="modal-footer">
            <input type="submit" onClick={this.props.handlers.onFormSubmit} className="btn btn-lg btn-primary col-xs-12 col-sm-4" disabled={!this.props.canSubmit} value={this.props.config.strings.submitButton}/>
        {this.props.isProcessing ?
        <div className="message col-xs-12 col-sm-4">
            <img src="https://resource.qal1.digitalinsight.com/leapfrog/1.0/img/loader.gif"/>
            <span className="message">{this.props.config.strings.loaderText}</span>
        </div>
        :''
        }
    </div>
        </form>
    );
    }
}