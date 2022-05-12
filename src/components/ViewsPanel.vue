<template>
  <div class="views-panel">
    <PanelLayout @close-panel="$store.commit('SET_componentName','')">
      <template v-slot:title> 视点管理</template>
      <template v-slot:content>
        <div class="views-panel-content">
          <div class="views-panel-input">
            <el-input v-model="input" placeholder="请输入视点名称" />
            <el-button
              size="mini"
              icon="el-icon-circle-plus-outline"
              @click="addViewport"
            >添加
            </el-button>
          </div>
          <div class="views-panel-list">
            <el-table :data="filterTableData" style="width: 100%">
              <el-table-column label="名称" width="180">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作按钮">
                <div class="action-icon" slot-scope="scope">
                  <i
                    class="el-icon-position"
                    tabindex="1"
                    @click="handleSetView(scope.$index, scope.row)"
                  ></i>
                  <i
                    class="el-icon-collection"
                    tabindex="2"
                    @click="handlePatch(scope.$index, scope.row)"
                  ></i>
                  <i
                    class="el-icon-delete"
                    tabindex="3"
                    @click="handleDelete(scope.$index, scope.row)"
                  ></i>
                </div>
              </el-table-column>
            </el-table>
          </div>
          <div class="views-panel-page">
            <el-pagination
              small
              @current-change="handleCurrentChange"
              :page-size="5"
              layout="prev, pager, next, jumper"
              :current-page="currentPage"
              :total="total"
              :pager-count="5"
            >
            </el-pagination>
          </div>
        </div>
      </template>
    </PanelLayout>
  </div>
</template>

<script>
import PanelLayout from "@/components/PanelLayout";
import { addView, deleteView, getView, patchView } from "@/apis/view";
import { flyTo } from "@/utils/view";

export default {
  name: "ViewsPanel",
  components: { PanelLayout },
  data() {
    return {
      input: "",
      currentPage: 1,
      tableData: [],
      total: 0
    };
  },
  created() {
    this.updateList();
  },
  computed: {
    filterTableData() {
      return this.tableData.slice(
        5 * (this.currentPage - 1),
        5 * this.currentPage
      );
    }
  },
  methods: {
    handleSetView(index, row) {
      const { x, y, z, heading, pitch, roll } = row;
      flyTo(x, y, z, heading, pitch, roll);
    },
    updateList() {
      getView().then((res) => {
        this.tableData = res.data.features.map((item) => {
          return {
            smId: item.fieldValues[0],
            name: item.fieldValues[2],
            x: +item.fieldValues[3],
            y: +item.fieldValues[4],
            z: +item.fieldValues[5],
            heading: +item.fieldValues[6],
            pitch: +item.fieldValues[7],
            roll: +item.fieldValues[8]
          };
        });
        this.total = this.tableData.length;
      });
    },
    async handlePatch(index, row) {
      const { name, smId } = row;
      const {
        cameraX,
        cameraY,
        cameraZ,
        cameraPitch,
        cameraHeading,
        cameraRoll
      } = this.getCameraParam();
      await patchView(
        smId,
        name,
        cameraX,
        cameraY,
        cameraZ,
        cameraHeading,
        cameraPitch,
        cameraRoll
      );
      this.updateList();
    },
    async handleDelete(index, row) {
      await deleteView(row.smId);
      this.updateList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getCameraParam() {
      const cameraX = viewer.camera.position.x;
      const cameraY = viewer.camera.position.y;
      const cameraZ = viewer.camera.position.z;
      const cameraPitch = viewer.camera.pitch;
      const cameraHeading = viewer.camera.heading;
      const cameraRoll = viewer.camera.roll;
      return {
        cameraX,
        cameraY,
        cameraZ,
        cameraPitch,
        cameraHeading,
        cameraRoll
      };
    },
    addViewport() {
      if (this.input === "" || this.total >= 25) return;
      const {
        cameraX,
        cameraY,
        cameraZ,
        cameraPitch,
        cameraHeading,
        cameraRoll
      } = this.getCameraParam();
      addView(
        this.input,
        cameraX,
        cameraY,
        cameraZ,
        cameraHeading,
        cameraPitch,
        cameraRoll,
        this.updateList
      );
      this.input = "";
    }
  }
};
</script>

<style lang="scss"></style>

<style lang="scss" scoped>
$background-blue: rgba(21, 54, 91, 0.65);

::v-deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

::v-deep .el-table tr {
  background-color: transparent !important;
}

::v-deep .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  color: white;
}

::v-deep .el-table th.is-leaf,
.el-table td {
  color: #fff;
  background: none;
  font-size: 16px;
  border: none;
}

.el-table {
  border: 1px solid #0874a6;
}

::v-deep .el-table--enable-row-transition .el-table__body td {
  color: #fff;
  font-size: 14px;
  background: transparent !important;
  border-bottom: 1px solid #0874a6;
}

::v-deep .el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #0874a6;
}

.el-table::before {
  //去除底部白线
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}

::v-deep .el-table__empty-block {
  background: $background-blue;
}

.views-panel {
  position: absolute;
  z-index: 999;
  right: 8px;
  top: 213px;

  &-input {
    margin-bottom: 12px;
    display: flex;

    .el-button {
      background: rgba(11, 188, 215, 1);
      color: white;
      border: none;
    }

    ::v-deep .el-input__inner {
      height: 28px;
      border-radius: 0;
      background: none;
      color: white;
      border: 1px solid rgba(6, 115, 169, 1);
    }

    .el-button {
      margin-left: 6px;
    }
  }

  &-list {
    .action-icon {
      > i {
        margin-right: 12px;
      }
    }
  }

  &-page {
    margin-top: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    .el-pagination {
    }

    ::v-deep .el-pagination__jump {
      color: white;
    }
  }
}

/*::v-deep .el-pagination button:disabled{
  background: none;
}
::v-deep .el-pagination .btn-prev{
  background: none;
}*/
</style>
