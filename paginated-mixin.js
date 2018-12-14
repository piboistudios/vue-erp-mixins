import { consumePropOrOther, generateMagicProperties } from './utils/functions';
export default {
    props: {

        value: {
            type: String | Number,
            default: 1,
        },
        pageSize: {
            type: String | Number | Function,
            default: 10,
        },
        items: {
            type: String | Number,
            default: 0
        },
        looped: {
            type: Boolean | Function,
            default: true,
        }
    },
    data() {
        return {
            internalValue: 1,
        }
    },
    computed:
        Object.assign({
            Pages() {
                return Number(this._items) / Math.max(Number(this._pageSize), 1);
            },
            Page() {
                return Number(this.internalValue);
            }
        },
            generateMagicProperties(['looped', 'items', 'pageSize'])
        ),
    methods: {
        ChangePage(val) {
            if (!this.Pages) return;
            this.internalValue = val;
            this.$emit('input', val);
        },
        NextPage() {
            if (!this.Pages) return;
            console.log("success");
            const oldValue = Number(this.internalValue);
            const newValue = oldValue + 1;
            const { Pages, _looped } = this;
            this.ChangePage(_looped ? Math.max(newValue % Pages, 1) : Math.min(newValue, Pages));
            this.$emit('page-changed', { oldValue, newValue });
        },
        PreviousPage() {
            if (!this.Pages) return;
            const oldValue = Number(this.internalValue);
            const newValue = oldValue - 1;
            const { Pages, _looped } = this;
            this.ChangePage(newValue === 0 ? _looped ? Pages : oldValue : newValue);
            this.$emit('page-changed', { oldValue, newValue });
        }
    }
}

