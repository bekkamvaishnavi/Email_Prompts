import alt from '../alt';
import EmailUpdateActions from '../actions/EmailUpdateActions';

class EmailUpdateStore {

    constructor() {
        this.emailUpdateState = {};

        this.bindListeners({
            handleInitEmailAction: EmailUpdateActions.INIT_EMAIL_UPDATE,
            handlePrimaryEmailChangeAction: EmailUpdateActions.PRIMARY_EMAIL_CHANGED,
            handlePrimaryEmailBlurAction: EmailUpdateActions.PRIMARY_EMAIL_BLURRED,
            handleConfirmEmailChangeAction: EmailUpdateActions.CONFIRM_EMAIL_CHANGED,
            handleConfirmEmailBlurAction: EmailUpdateActions.CONFIRM_EMAIL_BLURRED,
            handleBillPayEmailChangeAction: EmailUpdateActions.BILL_PAY_EMAIL_CHANGED,
            handleBillPayEmailBlurAction: EmailUpdateActions.BILL_PAY_EMAIL_BLURRED,
            handleUseSameEmailToggledAction: EmailUpdateActions.USE_SAME_EMAIL_TOGGLED,
            handleEmailFormSubmittedAction: EmailUpdateActions.EMAIL_UPDATE_FORM_SUBMITTED,
            handleServerErrorConfirmedAction: EmailUpdateActions.SERVER_ERROR_CONFIRMED
        });
    }

    handleInitEmailAction(config) {
        /*  Set the initial values (primaryEmail, bpEmail etc., then add auxiliary values, like checkbox value  */
        this.propConfig = config;
        let primaryEmail = config.primaryEmail;
        let billPayEmail = config.billPayEmail;
        let initialEmailIsSame = ((typeof primaryEmail === 'string' && typeof billPayEmail === 'string' && primaryEmail.toLowerCase().trim() === billPayEmail.toLowerCase().trim()));
        var initialBillPayEmail = config.billPayEmail;
        if(!config.bpEmailEnabled){
            initialBillPayEmail = '';
        }
        this.emailUpdateState = {
            promptShowing: true,
            isProcessing: false,
            serverError: false,
            primaryEmail: config.primaryEmail,
            isPrimaryEmailDirty: false,
            confirmEmail: '',
            isConfirmEmailDirty: false,
            billPayEnabled: config.bpEmailEnabled,
            billPayEmail: initialBillPayEmail,
            isBillPayEmailDirty: false,
            useSameEmail: initialEmailIsSame,
            billPayEmailClsName: 'row form-group' + (initialEmailIsSame ? 'hide' : 'show'),
            canSubmit: false,
            isFormValid: false,
            xt: config.xt,   // CSRFToken
            emailUpdateURL: config.emailUpdateURL
        };
        /*  With values filled, show errors if needed. This can be disabled if we don't want errors to show up at init  */
        this.validate();
    }

    validate() {
        let primaryEmail = this.emailUpdateState.primaryEmail;
        let confirmEmail = this.emailUpdateState.confirmEmail;
        let billPayEmail = this.emailUpdateState.billPayEmail;
        let initialEmailIsSame = (typeof primaryEmail === 'string' && typeof billPayEmail === 'string' && primaryEmail.toLowerCase().trim() === billPayEmail.toLowerCase().trim());
        var emailFormatTest = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2,})$/i;
        //let primaryEmailIsValid = typeof primaryEmail === 'string' && emailFormatTest.test(primaryEmail);
        //let confirmEmailIsValid = typeof primaryEmail === 'string' && typeof confirmEmail === 'string' && primaryEmail.toLowerCase() === confirmEmail.toLowerCase();
        //let billPayEmailIsValid = !this.emailUpdateState.billPayEnabled || (initialEmailIsSame ? primaryEmailIsValid : (typeof billPayEmail === 'string' && emailFormatTest.test(billPayEmail)));

        /*  Validate primary email  */
        var primaryEmailValid = false;
        if (typeof primaryEmail !== 'string' || primaryEmail.trim() === '') {
            /*  Primary email is blank  */
            this.emailUpdateState.primaryEmailErrorMessage = this.propConfig.strings.emailBlankErrorMessage;
        } else if (!emailFormatTest.test(primaryEmail)) {
            this.emailUpdateState.primaryEmailErrorMessage = this.propConfig.strings.emailFormatErrorMessage;
        } else {
            primaryEmailValid = true;
        }

        /*  Validate confirm email  */
        var confirmEmailValid = false;
        if (typeof primaryEmail === 'string' && typeof confirmEmail === 'string' && primaryEmail.toLowerCase() === confirmEmail.toLowerCase()) {
            confirmEmailValid = true;
        } else {
            this.emailUpdateState.confirmEmailErrorMessage = this.propConfig.strings.emailMismatchErrorMessage;
        }

        /*  Validate billPay email  */
        var billPayEmailValid = false;
        if (this.emailUpdateState.billPayEnabled) {
            if (initialEmailIsSame) {
                billPayEmailValid = primaryEmailValid;
                if (!billPayEmailValid) {
                    this.emailUpdateState.billPayEmailErrorMessage = this.emailUpdateState.primaryEmailErrorMessage;
                }
            } else {
                if (typeof billPayEmail !== 'string' || billPayEmail.trim() === '') {
                    this.emailUpdateState.billPayEmailErrorMessage = this.propConfig.strings.emailBlankErrorMessage;
                } else if (!emailFormatTest.test(billPayEmail)) {
                    this.emailUpdateState.billPayEmailErrorMessage = this.propConfig.strings.emailFormatErrorMessage;
                } else {
                    billPayEmailValid = true;
                }
            }
        } else {
            /*  BillPay is disabled so we'll consider it valid  */
            billPayEmailValid = true;
            this.emailUpdateState.billPayEmailErrorMessage = '';
        }
        this.emailUpdateState.primaryEmailIsValid = !this.emailUpdateState.isPrimaryEmailDirty || primaryEmailValid;
        this.emailUpdateState.confirmEmailIsValid = !this.emailUpdateState.isConfirmEmailDirty || confirmEmailValid;
        this.emailUpdateState.billPayEmailIsValid = !this.emailUpdateState.isBillPayEmailDirty || billPayEmailValid;
        this.emailUpdateState.isFormValid = primaryEmailValid && billPayEmailValid && confirmEmailValid;
    }

    handlePrimaryEmailChangeAction(primaryEmailAddress) {
        this.emailUpdateState.primaryEmail = primaryEmailAddress;
        /*  We can compare the current value against the form's init value to set the pristine variable also.
         For now, we'll keep things simple by setting pristine to false with the very first change.
         */
        this.emailUpdateState.isPrimaryEmailDirty = true;
    }

    handlePrimaryEmailBlurAction() {
        this.emailUpdateState.isPrimaryEmailDirty = true;
        this.emailUpdateState.isConfirmEmailDirty = false;
        this.validate();
        //if (typeof this.emailUpdateState.primaryEmail === 'string' && primaryEmail.trim() !== '') {
        this.emailUpdateState.canSubmit = true;
        //}
    }

    handleConfirmEmailChangeAction(confirmEmailAddress) {
        this.emailUpdateState.confirmEmail = confirmEmailAddress;
    }

    handleConfirmEmailBlurAction() {
        this.emailUpdateState.isConfirmEmailDirty = true;
        this.validate();
        this.emailUpdateState.canSubmit = true;
    }

    handleBillPayEmailChangeAction(billPayEmailAddress) {
        this.emailUpdateState.billPayEmail = billPayEmailAddress;
        this.emailUpdateState.isBillPayEmailDirty = true;
    }

    handleBillPayEmailBlurAction() {
        this.emailUpdateState.isBillPayEmailDirty = true;
        this.validate();
        this.emailUpdateState.canSubmit = true;
    }

    handleUseSameEmailToggledAction() {
        this.emailUpdateState.useSameEmail = !this.emailUpdateState.useSameEmail;
        if (this.emailUpdateState.useSameEmail) {
            this.emailUpdateState.billPayEmail = this.emailUpdateState.primaryEmail;
            this.emailUpdateState.isBillPayEmailDirty = false;
        } else {
            this.emailUpdateState.billPayEmail = this.propConfig.billPayEmail;
        }
        this.validate();
        this.emailUpdateState.canSubmit = true;
    }

    handleEmailFormSubmittedAction(data) {
        this.emailUpdateState.isPrimaryEmailDirty = true;
        this.emailUpdateState.isConfirmEmailDirty = true;
        this.emailUpdateState.isBillPayEmailDirty = true;
        this.validate();
        let isProcessing = !!(data.stage && data.stage === 'starting');
        if (this.emailUpdateState.isFormValid) {
            if (isProcessing) {
                this.emailUpdateState.canSubmit = false;
            }
            this.emailUpdateState.isProcessing = isProcessing;
            this.emailUpdateState.serverError = !(isProcessing || data.success);
            if (!isProcessing && !this.emailUpdateState.serverError) {
                /*  Hide the prompt if save was a success   */
                this.emailUpdateState.promptShowing = false;
            }
        }
    }

    handleServerErrorConfirmedAction() {
        this.emailUpdateState.promptShowing = false;
    }
}

export default alt.createStore(EmailUpdateStore, 'EmailUpdateStore');