<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="sku" v-model="listQuery.title" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建</el-button>
      <upload-excel-component :on-success="handleImportSuccess" :before-upload="beforeImportUpload"/>
    </div>  
    <el-table
      ref="test"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.product_id }}
        </template>
      </el-table-column>
      <el-table-column label="Sku">
        <template slot-scope="scope">
          {{ scope.row.sku }}
        </template>
      </el-table-column>
      <el-table-column label="Name" width="320">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Purchase Price" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purchase_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Shipping Cost" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.shipping_cost }}
        </template>
      </el-table-column>
      <el-table-column label="Weight" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="Qty" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.qty }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 700px; margin-left:50px;">
        <!--<el-form-item label="状态">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>-->
        <el-form-item label="编码" prop="sku">
          <el-input v-model="temp.sku"/>
        </el-form-item>
        <el-form-item label="批发价" prop="purchase_price">
          <el-input v-model="temp.purchase_price"/>
        </el-form-item>
        <el-form-item label="运费" prop="shipping_cost">
          <el-input v-model="temp.shipping_cost"/>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="temp.weight"/>
        </el-form-item>
        <el-form-item label="库存" prop="qty">
          <el-input v-model="temp.qty"/>
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <Tinymce ref="editor" :height="400" v-model="temp.description" />
        </el-form-item>
        <el-form-item label="尺码" prop="size">
          <el-checkbox-group v-model="temp.size">
            <el-checkbox-button v-for="size in options.size" :label="size.id" :key="size.id">{{size.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-checkbox-group v-model="temp.color">
            <el-checkbox-button v-for="color in options.color" :label="color.id" :key="color.name">{{color.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="站点" prop="website_ids">
          <el-checkbox-group v-model="temp.website_ids">
            <el-checkbox-button v-for="website in websites" :label="website.website_id" :key="website.website_name">{{website.website_name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="分类" prop="category_ids">
          <el-cascader :options="categorys" v-model="temp.category_ids"></el-cascader>
        </el-form-item>

        <el-form-item label="分类2" prop="category2_ids">
          <el-cascader :options="categorys" v-model="temp.category2_ids"></el-cascader>
        </el-form-item>
        <el-form-item label="主图片" prop="main_image" ref="main_image">
          <el-upload
            :action="uploadUrl()"
            :headers="myheader"
            :file-list="temp.main_image"
            list-type="picture-card"
            :on-remove="handleMainImageRemove"
            :on-success="handleMainImageSuccess"
            :limit="1">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="附加图片" prop="addition_images" ref="addition_images">
          <el-upload
            :action="uploadUrl()"
            :headers="myheader"
            :file-list="temp.addition_images"
            list-type="picture-card"
            :on-remove="handleAdditionImagesRemove"
            :on-success="handleAdditionImagesSuccess"
            multiple
            :limit="5">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,fetchList, fetchPv, createProduct, updateProduct, importProduct, getOptions, getCategorys, getWebsite } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'
import Sortable from 'sortablejs'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

var token = 'Bearer '+getToken();

export default {
  components: { Pagination, Tinymce, UploadExcelComponent },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        size:[],
        color: [],
        website_ids: [],
      },
      dialogFormVisible: false,
      dialogStatus: '',
      isDisabled: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        sku: [{ required: true }],
        purchase_price: [{ required: true } ],
        shipping_cost: [{ required: true } ],
        weight: [{ required: true } ],
        qty: [{ required: true } ],
        name: [{ required: true } ],
        description: [{ required: true } ],
        color: [{ required: true } ],
        size: [{ required: true } ],
        main_image: [{ required: true } ],
        addition_images: [{ required: true } ],
        category_ids: [{ required: true } ],
        category2_ids: [{ required: true } ],
        website_ids: [{ required: true } ],
        //name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      statusOptions: ['published', 'draft', 'deleted'],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      options: [],
      websites: [],
      categorys: [],
      myheader: {
        Authorization: token
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
      
      //get product options
      getOptions().then(response => {
        this.options = response
      })
      //get system category
      getCategorys().then(response =>{
        this.categorys = response;
      })
      //get website
      getWebsite().then(response => {
        this.websites = response
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      //this.temp = {};
      this.dialogStatus = 'create'
      this.isDisabled = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        console.log(this.$refs.addition_images.$el);
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        const el = this.$refs.addition_images.$el.querySelectorAll('.el-upload-list')[0]
        this.sortable = Sortable.create(el,{
          onEnd: evt => {
            this.temp.addition_images_new = JSON.parse(JSON.stringify(this.temp.addition_images))
            const targetRow = this.temp.addition_images_new.splice(evt.oldIndex, 1)[0]
            this.temp.addition_images_new.splice(evt.newIndex, 0, targetRow)
          }
        });
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createProduct(this.temp).then(response => {
            this.temp.product_id = response.productId
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          if(this.temp.addition_images_new==null){

          }else{
            this.temp.addition_images = this.temp.addition_images_new
            this.temp.addition_images_new = null
          }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateProduct(tempData).then(() => {
            for (const v of this.list) {
              if (v.product_id === this.temp.product_id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    uploadUrl(){
      var url = process.env.BASE_API + "/product/image";
      return url;
    },
    handleMainImageRemove(file, fileList) {
      this.temp.main_image =fileList
    },
    handleMainImageSuccess(response, file, fileList){
      this.temp.main_image = fileList
      this.$refs.main_image.clearValidate()
    },
    handleAdditionImagesRemove(file, fileList) {
      this.temp.addition_images = fileList
    },
    handleAdditionImagesSuccess(response, file, fileList){
      this.temp.addition_images = fileList
      this.$refs.addition_images.clearValidate()
    },
    beforeImportUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleImportSuccess({ results, header }) {
      importProduct(results).then(()=>{
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          duration: 2000
        })
      })

      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
      //this.tableData = results
      //this.tableHeader = header
      
    }
  }
}
</script>


<style>
.filter-container{
  margin-bottom: 20px;
  float: right;
}
</style>

