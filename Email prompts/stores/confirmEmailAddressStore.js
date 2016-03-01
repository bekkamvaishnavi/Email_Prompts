import alt from '../alt';
import ConfirmEmailAddressActions from '../actions/ConfirmEmailAddressActions';

class ConfirmEmailAddressStore {
    constructor() {
        this.confirmEmailAddressState = {
            promptShowing: true
        };

        this.bindListeners({
            handleConfirmEmailAddress: ConfirmEmailAddressActions.CONFIRM_EMAIL_ADDRESS,
            handleChangeEmailAddress: ConfirmEmailAddressActions.CHANGE_EMAIL_ADDRESS,
            handleInitConfirmEmailAddress: ConfirmEmailAddressActions.INIT_CONFIRM_EMAIL_ADDRESS
        });
    }

    handleInitConfirmEmailAddress(config) {
        this.confirmEmailAddressState = {
            promptShowing: true,
            serverError: false,
            primaryEmail: config.primaryEmail,
            billPayEmail: config.billPayEmail,
            xt: config.xt,   // CSRFToken
            emailUpdateURL: config.emailUpdateURL
        };
    }

    handleConfirmEmailAddress(data) {
        if(data.confirming) {
            this.handleConfirmingEmailAddress();
            return;
        }

        if(data.success === false) {
            this.confirmEmailAddressState.serverError = true;
            this.confirmEmailAddressState.confirmingEmailAddress = false;
            return;
        }
        this.confirmEmailAddressState.emailAddressConfirmed = true;
        this.confirmEmailAddressState.confirmingEmailAddress = false;
        this.confirmEmailAddressState.promptShowing = false;
    }

    handleConfirmingEmailAddress() {
        this.confirmEmailAddressState.confirmingEmailAddress = true;
    }

    handleChangeEmailAddress() {
        this.confirmEmailAddressState.changeEmailAddress = true;
        this.confirmEmailAddressState.promptShowing = true;
    }
}

export default alt.createStore(ConfirmEmailAddressStore, 'ConfirmEmailAddressStore');