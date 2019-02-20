<template>
  <div class="app-container">
    <div class="filter-container">
     <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建</el-button> 
    </div>  
    <el-table
      ref="test"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="属性" width="95">
        <template slot-scope="scope">
          {{ scope.row.option_name }}
        </template>
      </el-table-column>
      <el-table-column label="属性值">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 700px; margin-left:50px;">
        <el-form-item label="属性" prop="option_name">
          <el-select v-model="temp.option_name" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="temp.value"/>
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
import { getList, createOption } from '@/api/productoption'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getToken } from '@/utils/auth'

var token = 'Bearer '+getToken();

export default {
  components: { Pagination },
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
        option_name: undefined,
        value: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      isDisabled: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        option_name: [{ required: true }],
        value: [{ required: true } ]
      },
      options: [{
          value: 'size',
          label: 'Size'
        }, {
          value: 'color',
          label: 'Color'
        }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
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
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleCreate() {
      //this.temp = {};
      this.dialogStatus = 'create'
      this.isDisabled = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          createOption(this.temp).then(response => {
            //this.temp.product_id = response.productId
            if(response){
                this.list.unshift(this.temp)
                this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
                })
            }
            this.dialogFormVisible = false
          })
        }
      })
    },

  }
}
</script>


<style>
.filter-container{
  margin-bottom: 20px;
  float: right;
}
</style>