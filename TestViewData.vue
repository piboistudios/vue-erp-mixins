<template lang="pug">
    .container
        .tile.is-ancestor
            .tile
                .tile.is-parent.is-8
                    article.tile.notification.is-child.is-primary
                        p.title ViewData
                        p.subtitle 
                            label this.ApiUrl: 
                            em {{ ApiUrl }}
                        pre.tile.notification.is-light.pre(v-for="(member, index) in PrettyData" :key="index") {{ member }}
                .tile.is-parent.is-ancestor.is-4
                    .tile.is-parent.is-vertical
                        article.tile.notification.is-child.is-dark.is-12
                            form(@submit.prevent="GetViewData({force: true})")
                                b-field(
                                    custom-class="has-text-light" 
                                    label="Seed:"
                                )
                                    b-input(
                                        v-model="seed"
                                        
                                        icon="search"
                                        icon-pack="fas"
                                    )
                                b-field(
                                    label="Page Size:"
                                    custom-class="has-text-light"
                                )
                                    b-input(
                                        v-model="results"
                                    )
                                b-field(
                                    label="Number of Records:"
                                    custom-class="has-text-light"
                                )
                                    b-input(
                                        v-model="records"
                                    )
                                b-field(
                                    label="Debounce Time:"
                                    custom-class="has-text-light"
                                )
                                    b-input(
                                        v-model="debounce"
                                    )
                            
                            b-field(label="Pages:") {{ Page }} / {{ Pages }}
                            button.button(@click="PreviousPage") Previous Page
                            button.button(@click="NextPage") Next Page
                            
</template>

<script>
// import ViewData from "./view-data-mixin";
import PaginatedViewData from "./paginated-view-data-mixin";
export default {
  name: "test-view-data",
  mixins: [PaginatedViewData],
  data() {
    return {
      seed: "abc",
      results: 10,
      records: 1000,
      canceled: false,
      debounce: 500
    };
  },
  computed: {
    ApiUrl() {
      return `https://randomuser.me/api/?seed=${encodeURIComponent(this.seed)}`;
    },
    OnError() {
      return err => this.Recover({ keepData: false });
    },
    PageSize() {
      return this.results;
    },
    Items() {
      return this.records;
    },
    PageNoParam() {
      return "page";
    },
    PageSizeParam() {
      return "results";
    },
    DebounceTime() {
      return this.debounce;
    },
    CancelWhen() {
      return {
        Page: Page => (newPage, oldPage) => {
          console.log({ newPage, oldPage });
          return true;
        }
      };
    },
    PrettyData() {
      const { ViewPage } = this;
      const ViewPageParsed =
        typeof ViewPage === "string" ? JSON.parse(ViewPage) : ViewPage;

      return (
        ViewPageParsed &&
        ViewPageParsed.results.map(
          randomUser => JSON.stringify(randomUser, null, 4) || []
        )
      );
    }
  }
};
</script>
