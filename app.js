new Vue({
    el: '#app',
    data: {
        currencies: {},
        amount: null,
        from: '',
        to: '',
        result: 0,
        date: new Date(),
        loading: false
    },
    mounted() {
        this.getCurrencies()
    },
    methods: {
        getCurrencies() {
            const currencies = localStorage.getItem('currencies')
            
            if(currencies) {
                this.currencies = JSON.parse(currencies)
                return
            }
            axios.get('https://free.currconv.com/api/v7/currencies?apiKey=ad6370db96292fd41046')
                .then(response => {
                    this.currencies = response.data.results
                localStorage.setItem('currencies', JSON.stringify(response.data.results))
            })
        },
        convertCurrency() {
            this.loading = true
            let key = `${this.from}_${this.to}`
            axios.get(`https://free.currconv.com/api/v7/convert?apiKey=ad6370db96292fd41046&q=${key}&compact=y`)
                .then((response) => {
                this.loading = false
                this.result = response.data[key].val
                console.log(this.result)
            })
        }
    },
    computed: {
        formattedCurrencies() {
            return Object.values(this.currencies)
        },
        calculateResult() {
            return (Number(this.amount) * this.result).toFixed(3)
        },
        disabled() {
            return this.amount === null || this.amount === 0 || !this.amount || (this.from === '' || this.to === '') || this.loading
        }
    },
    watch: {
        from() {
            this.result = 0
        },
        to() {
            this.result = 0
        }
    }
})