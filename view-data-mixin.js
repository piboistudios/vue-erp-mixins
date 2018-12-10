import { propOrOther, consumePropOrOther, AxiosTransformer, generateMagicProperties, generateNonEvaluatedMagicProperties } from './utils/functions';
const axios = require('axios').default;
const defaultNothing = () => ({
    type: Object | Function,
    default: () => null
});
const defaultTransformation = () => ({
    type: Function | Array,
    default: AxiosTransformer
});
const data = () => ({
    view: {
        data: null
    },
    internal: {
        busy: false,
        cancelClient: null,
    }
});

const viewDataMixin = {
    props: {
        apiUrl: String | Function,
        httpMethod: {
            type: String | Function,
            default: 'get',
        },
        baseURL: Function,
        transformRequest: defaultTransformation(),
        transformResponse: defaultTransformation(),
        headers: Object | Function,
        params: defaultNothing(),
        payload: defaultNothing(),
        auth: defaultNothing(),
        lazy: {
            type: Boolean | Function,
            default: true,
        },
        debounceTime: {
            type: Number | Function,
            default: -1
        },
        concatenate: Boolean | Function,
        onError: {
            type: Function,
            default: console.error
        },
        onSuccess: {
            type: Function,
            default: () => { }
        },
        getDataWhen: {
            type: Function,
            default: () => true
        },
        cancelWhen: defaultNothing()
    },
    computed: {
        ViewData() {
            const retVal = this.view.data;
            if (!retVal && this._lazy) this.GetViewData();
            return retVal || []
        },
        Busy() {
            return this.internal.busy;
        },
        ...generateMagicProperties([
            'debounceTime',
            'lazy',
            'apiUrl',
            'httpMethod',
            'headers',
            'onError',
            'onSuccess',
            'params',
            'baseURL',
            'payload',
            'auth',
            'concatenate',
            "cancelWhen"
        ]),
        ...generateNonEvaluatedMagicProperties([
            'transformRequest',
            'transformResponse',
            "onSuccess",
            "onError",
            'getDataWhen',

        ])

    },
    data,
    mounted() {
        this._$_init();
    },
    method: {
        _$_init() {
            if (this._cancelWhen !== null) {
                const { _cancelWhen } = this;

                Object.keys(_cancelWhen).forEach(key => {
                    const cancelWhenEntry = {
                        value: _cancelWhen[key],
                        isObject: _cancelWhen[key] instanceof Object && !_cancelWhen instanceof Function,
                        isFunction: _cancelWhen[key] instanceof Function
                    };
                    let deep = false;
                    if (cancelWhenEntry.isFunction) {
                        deep = _cancelWhen.deep;
                    }
                    const evaluation = !cancelWhenEntry.isFunction ?
                        cancelWhenEntry.isObject ?
                            cancelWhenEntry.value.evaluation :
                            () => false
                        :
                        cancelWhenEntry.value
                    if (this[key]) {
                        const cancelIfEvaluationIsTrue = (newVal, oldVal) => evaluation(newVal, oldVal) && this.internal.busy && this.cancelClient.cancel(`reason: ${oldVal} -> ${newVal}`);
                        this.$watch(key, cancelIfEvaluationIsTrue, deep ? { deep } : {});
                    }
                });
            }
        },
        Recover(cfg = { keepData: true, retry: false, ignoreDebounce: true }) {
            const { keepData, retry, ignoreDebounce } = cfg;
            const { _debounceTime } = this;
            if (!ignoreDebounce && _debounceTime < 0) this.internal.busy = false;
            !keepData && (this.view.data = null);
            retry && this.GetViewData();
            return;
        },
        AddViewData(data) {
            this.view.data instanceof Array && this.view.data.push(data);
        },
        RemoveViewData(query, count = 1) {
            if (!this.view.data instanceof Array) return;
            for (let index in this.view.data) {
                const object = this.view.data[index];
                const match = true;
                const keys = Object.keys(query);
                for (let index in keys) {
                    const key = keys[index];
                    if (object[key] !== query[key]) {
                        match = false;
                        break;
                    };
                }
                if (match) {
                    this.view.data.splice(index, 1);
                    if (--count === 0) break;
                }
            };
        },
        GetViewData(cfg = { force: false }) {
            console.log({ cfg });
            const { force } = cfg;
            const {
                _apiUrl,
                _httpMethod,
                _baseURL,
                _transformRequest,
                _debounceTime,
                _transformResponse,
                _headers,
                _params,
                _payload,
                _auth,
                _onSuccess,
                _onError,
                _concatenate,
                _getDataWhen
            } = this;
            if (this.internal.busy || (!force && !_getDataWhen())) return;
            this.cancelClient && this.cancelClient.cancel();
            const cancelClient = axios.CancelToken.source();
            this.cancelClient = cancelClient;

            this.internal.busy = true;
            if (_debounceTime > -1) {
                setTimeout(() => (this.internal.busy = false), _debounceTime);
            }
            this.$emit('begin-fetch');
            axios.request({
                url: _apiUrl,
                method: _httpMethod,
                baseURL: _baseURL,
                transformRequest: _transformRequest,
                transformResponse: _transformResponse,
                headers: _headers,
                params: _params,
                data: _payload,
                auth: _auth,
                cancelToken: this.cancelClient && this.cancelClient.token
            })
                .then(response => {
                    if (_debounceTime < 0) this.internal.busy = false;
                    const { data } = response;
                    if (data instanceof Array && _concatenate) {
                        if (!this.view.data) this.view.data = [];
                        this.view.data = this.view.data.concat(data);
                    }
                    else {
                        this.view.data = data;
                    }
                    this.$emit('fetch-success');
                    _onSuccess(data);
                    this.cancelClient = null;

                }).catch(err => {
                    this.$emit('fetch-failure');
                    _onError(err);
                    this.cancelClient = null;
                });

        }
    }
}
export default viewDataMixin;