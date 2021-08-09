<script>
import { h } from 'vue';
import { fetchApp } from '../services/apps';

export default {
  name: 'AppLoader',
  data(){
    return {
      loading: false,
      module:null,
    }
  },
  async created() {
    const m = await fetchApp(this.app,this.isSystemApp);
    this.module = m.default ? m.default : m;
  },
  props: {
    app: {
      required: true,
    },
    isSystemApp:{
      default:false,
      type:Boolean,
    }
  },
  render(){
    if (!this.module) {
      console.log('no loaded');
      return null;
    }
    console.log('loaded');
    return h(this.module,{
      value:true,
    });
  }
};
</script>
