import alt from '../alt';
import reqwest from 'reqwest';

class ConfirmEmailAddressActions {
    constructor() {
        this.generateActions('initConfirmEmailAddress');
        this.generateActions('changeEmailAddress');
    }

    confirmEmailAddress(appState) {
        var that = this;
        this.dispatch({confirming: true});

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

export default alt.createActions(ConfirmEmailAddressActions);