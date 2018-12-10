const { generateNonEvaluatedMagicProperties } = require('./utils/functions');
const scrollableMixin = {
    props: {
        onScrolledToBottom: {
            type: Function,
            default: () => { }
        }
    },
    created() {
        window.onscroll = () => {
            if (
                window.innerHeight + window.pageYOffset >=
                document.body.offsetHeight
            ) {
                this._onScrolledToBottom && this._onScrolledToBottom();
            }
        };
    },
    computed: generateNonEvaluatedMagicProperties(['onScrolledToBottom']),


}

export default scrollableMixin;