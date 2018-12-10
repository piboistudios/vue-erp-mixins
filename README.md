# Vue ERP Mixins
This is a collection of general purpose mixins specifically for data manipulation.

# Mixin Usage:
Each mixin allows props to be overriden using computed properties, data members or methods that have the same name as a given prop but with the first letter capitalized.
e.g.
_(In the component definition)_
```
<script>
import ViewData from 'vue-erp-mixins/view-data-mixin';
export default {
    mixins: [ViewData],
    computed: {
        ApiUrl() {
            return new Date().getDay() === 6 ? '/api/only-on-saturdays' : '/api/business-as-usual';
        }
    }
}
</script>
```
is the same as 
_(In a parent-component referencing the component with the mixin)_
```
<template>
<my-component-with-view-data-mixin 
    :api-url="new Date().getDay() === 6 '/api/only-on-saturdays' : '/api/business-as-usual'"
/>
</template>
```
is the same as 
_(In the component definition)_
```
<script>
import ViewData from 'vue-erp-mixins/view-data-mixin';
export default {
    mixins: [ViewData],
    data() {
        return {
            ApiUrl: new Date().getDay() === 6 ? '/api/only-on-saturdays' : '/api/business-as-usual'
        }
    }
}
</script>
```

# Mixins:
- **View Data** - essentially a component wrapper for the [axios](https://www.npmjs.com/package/axios) HTTP library.
  - _Description_: Bootstraps a component up with the ability to consume and display data from Web API endpoints.
  - _Props_
    - api-url - the API URL endpoint to consume
    - http-method - the HTTP Method to use
    - base-url - the base URL (this can be left blank if the api-url is a relative path or includes the full url)
    - transform-request - `(data, headers) => transformedData`
    - transform-response - `(data, headers) => transformedData`
    - headers - object with keys representing HTTP Headers
    - params - GET url params as an object
    - payload - POST data payload as an object
    - auth - { username : String, password : String} - Authorization to use
    - lazy - whether or not to lazy-load data when ViewData is referenced
    - debounce-time - debouncing time for the api-url
    - concatenate - whether or not to concatenate data; only works if the data received is always an array; will overwrite data if non-array data is received
    - onError - `error => void` - a callback for errors.
    - onSuccess - `data => void` - a callback for successful fetches.
    - getDataWhen - `() => true` or `true/false` - fetches are only allowed when this evaluates to or is equal to true; by default fetching is always allowed.
    - cancelWhen - an object with keys matching this Vue instance, the value of each is either an object containing cancel configuration options ({evaluation : Function, lazy : Boolean}) or function accepting the new and old values of a given property on this Vue instance and returning a boolean; if it returns true, it will cancel the current AJAX call, if there is one.
        Example:
        ```
        <button @click="cancelButtonPressed = true">Cancel AJAX</button>
        <my-component-with-view-data-mixin
            :cancel-when="{
                cancelButtonPressed: val => {
                    if(val) cancelButtonPressed = false;
                    return val;
                }
            }"
        />
        ```
        or
        ```
        <button @click="$router.push('/home-page')">Back to Home</button>
        <my-component-with-view-data-mixin
            :cancel-when="{
                '$route': {
                    evaluation: route => route.path==="/home-page",
                    deep: true,
                }
            }"
        />
        ```
  - _Methods_
    - `Recover(cfg = {keepData: true, retry: false, ignoreDebounce: true})` - Recovers from an error, allowing subsequent fetches. By default this overrides debounced recovery. Set ignoreDebounce to false to prevent this behavior.
    - `AddViewData(data)` - Adds an object to the ViewData if ViewData is an array.
    - `RemoveViewData(query, count=1)` - Removes _count_ number of objects that have values matching the query object. e.g.:
    ```
    RemoveViewData({name: 'bob'}, 10)
    ```
    Would remove 10 records named 'bob' from the scene.
    - `GetViewData(cfg={force: false})` - Gets ViewData. If the force option is set to true, this will override the `getDataWhen`/`GetDataWhen` instance members. 
  - _Events_
    - begin-fetch
    - fetch-success
    - fetch-failure
  - _Computed Properties_ 
    - ViewData - By default, this is a lazy-loaded reference to the data pointed to by the api-url.
- **Paginated (supports v-model)** - 
    - _Description_: Bootstraps a component with the ability to handle pagination safely.
    - _Props_
        - value - For v-model support
        - pageSize
        - items - The total number of 'items' that will exist in this component
        - looped - Whether or not to loop when traversing pages.
    - _Methods_
        - `ChangePage(val)`
        - `NextPage`
        - `PreviousPage`
    - _Events_
        - input - for v-model support
        - page-changed - Happens just before input, emits `{oldValue, newValue}`
    - _Computed Properties_
        - Page - The current page
        - Pages - The total number of pages
- **Paginated View Data Mixin (supports v-model for page number)** -
    - _Description_: A paginated view data mixin. Caches pages; use GetViewData({force: true}) to reload a page.
    - _Props_
        - ...ViewData props
        - ...Paginated props
        - pluck-total-items - This function plucks the total items off of a response payload, assuming one is provided. Leave this undefined if total-items is not provided by the API endpoint.
        - page-no-param - This is the data member name (URL param or data payload) of the page number for outgoing requests. By default it is "pageNo""
        - page-size-param - This is the data member name of the page size for outgoing requests. By default it is "pageSize"
    - _Computed Properties_
        - ...ViewData computed properties
        - ...Paginated computed properties
        - ViewPage - The current page being viewed
![preview](https://i.ibb.co/QknK6bX/image.png)