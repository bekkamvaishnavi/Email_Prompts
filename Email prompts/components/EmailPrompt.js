//var React = window.React;
import React from 'react';
import EmailUpdateStore from '../stores/EmailUpdateStore';
import EmailUpdateActions from '../actions/EmailUpdateActions';
import EmailUpdateForm from './EmailUpdateForm';
import ConfirmEmailAddressForm from './ConfirmEmailAddressForm';
import ConfirmEmailAddressStore from '../stores/ConfirmEmailAddressStore';
import ConfirmEmailAddressActions from '../actions/ConfirmEmailAddressActions';



export default class EmailPromptModal extends React.Component {
    componentDidMount() {
        EmailUpdateStore.listen(this.onChange.bind(this));
        ConfirmEmailAddressStore.listen(this.onChange.bind(this));
        /*  Triggering initiate action to setup the store correctly */
        this.setState ({});
        EmailUpdateActions.initEmailUpdate(this.props.config);
        ConfirmEmailAddressActions.initConfirmEmailAddress(this.props.config);
    }

    componentWillUnmount() {
        EmailUpdateStore.unlisten(this.onChange);
        ConfirmEmailAddressStore.unlisten(this.onChange);
    }

    onChange() {
        this.setState(EmailUpdateStore.getState().emailUpdateState);
        this.setState({'confirmEmailAddressState':
        ConfirmEmailAddressStore.getState().confirmEmailAddressState});
    }

    /*  Event Handlers. Handle component events and trigger actions.  */

    /**
     * Handles PrimaryEmailChange event
     */
    primaryEmailChangeHandler(evt) {
        EmailUpdateActions.primaryEmailChanged(evt.target.value);
    }

    /**
     * Handles PrimaryEmailBlur event
     */
    primaryEmailBlurHandler(evt) {
        EmailUpdateActions.primaryEmailBlurred();
    }

    /**
     * Handles ConfirmEmailChange event
     */
    confirmEmailChangeHandler(evt) {
        EmailUpdateActions.confirmEmailChanged(evt.target.value);
    }

    /**
     * Handles ConfirmEmailBlur event
     */
    confirmEmailBlurHandler(evt) {
        EmailUpdateActions.confirmEmailBlurred();
    }

    /**
     * Handles BPEmailChange event
     */
    bpEmailChangeHandler(evt) {
        EmailUpdateActions.billPayEmailChanged(evt.target.value);
    }

    /**
     * Handles BPEmailBlur event
     */
    bpEmailBlurHandler() {
        EmailUpdateActions.billPayEmailBlurred();
    }

    /**
     * Handles UseSameEmailToggled event
     */
    useSameEmailToggleHandler() {
        EmailUpdateActions.useSameEmailToggled();
    }

    /**
     * Handles form submission which triggers an action that will make AJAX call and also set processing to true
     */
    formSubmitHandler(evt) {
        /*  Show processing, make AJAX call and dispatch with the result, success or failure */
        EmailUpdateActions.emailUpdateFormSubmitted(this.state);
        evt.preventDefault();
    }

    /**
     * Executes on AJAX return shows error screen in case of error, or dismisses the form in case of success
     * */
    serverErrorConfirmedHandler() {
        EmailUpdateActions.serverErrorConfirmed();

    }

    confirmEmailAddressBtnHandler() {
        ConfirmEmailAddressActions.confirmEmailAddress(this.state.confirmEmailAddressState);
    }

    changeEmailAddressBtnHandler() {
        ConfirmEmailAddressActions.changeEmailAddress();
    }

    render() {
        var that = this;
        var handlers = {
            primaryEmailChangeHandler: this.primaryEmailChangeHandler.bind(that),
            primaryEmailBlurHandler: this.primaryEmailBlurHandler.bind(that),
            confirmEmailChangeHandler: this.confirmEmailChangeHandler.bind(that),
            confirmEmailBlurHandler: this.confirmEmailBlurHandler.bind(that),
            bpEmailChangeHandler: this.bpEmailChangeHandler.bind(that),
            bpEmailBlurHandler: this.bpEmailBlurHandler.bind(that),
            useSameEmailToggleHandler: this.useSameEmailToggleHandler.bind(that),
            onFormSubmit: this.formSubmitHandler.bind(that)
        };
        var confirmEmailAddressHandlers = {
            confirmEmailAddressBtnHandler: this.confirmEmailAddressBtnHandler.bind(this),
            changeEmailAddressBtnHandler: this.changeEmailAddressBtnHandler.bind(this)
        };

        /*  Creating local variable for state so we don't get undefined state while initAction is creating initial state in store */
        var thisState = this.state || {};

        return (
            <div className="leapfrog-body">
        { thisState.promptShowing && (!thisState.confirmEmailAddressState ||
        (thisState.confirmEmailAddressState &&
            thisState.confirmEmailAddressState.promptShowing
        ))?
    <div>
        <div className="modal fade show in" role="dialog">
            <div className="modal-dialog">
            <div className="modal-content">
            <div className="">
            <div>
            { !thisState.serverError && !(thisState.confirmEmailAddressState &&
        thisState.confirmEmailAddressState.serverError)?
    <div>
        {(thisState.confirmEmailAddressState &&
            thisState.confirmEmailAddressState.changeEmailAddress
        ) || !this.props.config.isOOSyncEmail?
    <EmailUpdateForm config={this.props.config} handlers={handlers}
        primaryEmail={thisState.primaryEmail}
        primaryEmailIsValid={thisState.primaryEmailIsValid}
        primaryEmailErrorMessage={thisState.primaryEmailErrorMessage}
        confirmEmail={thisState.confirmEmail}
        confirmEmailIsValid={thisState.confirmEmailIsValid}
        confirmEmailErrorMessage={thisState.confirmEmailErrorMessage}
        billPayEmail={thisState.billPayEmail}
        billPayEmailIsValid={thisState.billPayEmailIsValid}
        billPayEmailErrorMessage={thisState.billPayEmailErrorMessage}
        useSameEmail={thisState.useSameEmail}
        canSubmit={thisState.canSubmit}
        isProcessing={thisState.isProcessing}
    />
    :

    <ConfirmEmailAddressForm config={this.props.config}
        primaryEmail={this.props.config.primaryEmail}
        saving={thisState.confirmEmailAddressState?
            thisState.confirmEmailAddressState.confirmingEmailAddress:false}
        handlers={confirmEmailAddressHandlers}/>
    }
    </div>
    :
    <EmailUpdateServerError
        config={this.props.config}
        serverError={thisState.serverError}
        clickHandler={this.serverErrorConfirmedHandler.bind(that)}
    />
    }
    </div>
        </div>
        </div>
        </div>
        </div>
        <div className="modal-backdrop fade in"></div>
            </div>:''}
    </div>
    );
    }
}

class EmailUpdateServerError extends React.Component {
    render() {
        return (
            <div>
            <span className="modal-title"><span dangerouslySetInnerHTML={{__html:this.props.config.strings.serverErrorTitle}}></span></span>
        <div className="modal-body">
            <div className="form modal-body-content">
            <span className="h3">{this.props.config.strings.serverErrorDescription}</span>
        </div>
        </div>
        <div className="modal-footer">
            <button type="submit" className="btn btn-lg btn-primary col-xs-12 col-sm-4" onClick={this.props.clickHandler}>{this.props.config.strings.okButton}</button>
        </div>
        </div>
    );
    }
}