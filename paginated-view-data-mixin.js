import paginated from './paginated-mixin';
import viewData from './view-data-mixin';
import { consumePropOrOther, generateMagicProperties } from './utils/functions';
export default {
    mixins: [paginated, viewData],
    props: {
        pluckTotalItems: Function,
        pageNoParam: {
            type: String | Function,
            default: "pageNo",
        },
        pageSizeParam: {
            type: String | Function,
            default: "pageSize",
        },
    },
    computed: Object.assign({
        Params() {
            const { _httpMethod } = this;
            if (_httpMethod.toLowerCase() !== "get") return {};
            return this.dataPayload;
        },
        Payload() {
            const { _httpMethod } = this;
            if (_httpMethod.toLowerCase() === "get") return {};
            return this.dataPayload;
        },
        dataPayload() {
            const { _pageNoParam, _pageSizeParam, _pageSize } = this;
            const retVal = {};
            retVal[_pageNoParam] = this.internalValue;
            retVal[_pageSizeParam] = _pageSize;
            return retVal;
        },
        GetDataWhen() {
            return this.pages[this.Page] === undefined
        },
        OnSuccess() {
            return data => {
                this._pluckTotalItems && (this.items = this._pluckTotalItems(data))
                this.pages[this.Page] = data
            };
        },
        ViewPage() {
            const retVal = this.pages[this.Page];
            if (!retVal) this.GetViewData();
            return retVal;
        }
    },
        generateMagicProperties(['pluckTotalItems', "pageNoParam", "pageSizeParam", "httpMethod", "pageSize"])),
    watch: {
        Page(newPage, oldPage) {
            this.GetViewData();
        }
    },
    data() {
        return {
            pages: []
        }
    },


}