import alt from '../alt';
import reqwest from 'reqwest';

/**
 * Considered to be "ActionCreator" as it just creates/ dispatches Actions
 *
 * */
class EmailUpdateActions {
    constructor() {
        this.generateActions('initEmailUpdate');
        this.generateActions('primaryEmailChanged');
        this.generateActions('primaryEmailBlurred');
        this.generateActions('confirmEmailChanged');
        this.generateActions('confirmEmailBlurred');
        this.generateActions('billPayEmailChanged');
        this.generateActions('billPayEmailBlurred');
        this.generateActions('useSameEmailToggled');
        this.generateActions('serverErrorConfirmed');
    }

    emailUpdateFormSubmitted(appState) {
        var that = this;
        that.dispatch({stage: 'starting'});
        if (!appState.isFormValid) {
            return;
        }
        reqwest({
            url: appState.emailUpdateURL
            , method: 'post'
            , data: `primaryEmail=${appState.primaryEmail}&billPayEmail=${appState.billPayEmail}&xt=${appState.xt}`
            , contentType: 'application/x-www-form-urlencoded'
            , error: function (err) {
                var resultObject = {
                    success: false,
                    failureReason: err
                };
                that.dispatch(resultObject);
            }
            , success: function (responseModel) {
                var resultObject = {
                    success: responseModel.success === true,
                    failureReason: '',
                    responseText: responseModel
                };
                that.dispatch(resultObject);
            }
        });
    }
}

export default alt.createActions(EmailUpdateActions);
