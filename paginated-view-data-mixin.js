import paginated from './paginated-mixin';
import viewData from './view-data-mixin';
import { consumePropOrOther, generateMagicProperties } from './utils/functions';
export default {
    mixins: [paginated, viewData],
    props: {
        pluckTotalItems: Function,
        pageNoProp: {
            type: String | Function,
            default: "pageNo",
        },
        pageSizeProp: {
            type: String | Function,
            default: "pageSize",
        },
    },
    computed: {
        Params() {
            const retVal = {};
            const pageNoProp = consumePropOrOther(this, "pageNoProp");
            const pageSizeProp = consumePropOrOther(this, "pageSizeProp");
            retVal[pageNoProp] = this.internalValue;
            retVal[pageSizeProp] = consumePropOrOther(this, "pageSize");
            return retVal;
        },
        GetDataWhen() {
            return () => this.pages[this.Page] === undefined
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
        },
        ...generateMagicProperties(['pluckTotalItems'])
    },
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