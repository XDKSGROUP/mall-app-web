<template>
    <view class="classifyTree">
      <view class="tree" v-for="(item, index) in classData" :key="index">
        <view class="classify border-bottom" 
            :class="[{
              'active': item.openChild
            }]"
            :style="item.level>3? 'padding-left: 9px' : 'padding-left:'+(item.level*3)+'px' "
            @click="selectClassify(item)">
          <view class="text">
            {{item.title}} 
          </view>
          <!-- 没有子节点不渲染箭头 -->
          <!-- <uni-icons v-if="item.children && item.children.length > 0" 
            :type="item.openChild? 'arrowup' : 'arrowdown'" size="15" color="#ccc"></uni-icons> -->
        </view>
        
        <view v-if="item.openChild">
          <view class="child" v-if="item.children && item.children.length > 0">
            <classify-tree :treeData="item.children" @select="emitItem" ></classify-tree>
          </view>
        </view>
        
      </view>
    </view>
  </template>
  
  <script>
    import classifyTree from './node'
    export default {
      props: {
        treeData: Array,
      },
      data() {
        return {
          classData: [],
        }
      },
      created() {
        this.classData = this.treeData;
      },
      components: {
        classifyTree
      },
      methods: {
        // 打开树
        emitItem(item) {
          this.$emit('select', item);
        },
        selectClassify(item) {
          this.$set(item, 'openChild', !item['openChild']);
          this.emitItem(item)
        }
      }
    }
  </script>
  
  <style lang="scss">
    .classifyTree {
      .tree {
        .classify {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40rpx 0;
          .text {
            color: #1F315F;
            font-size: 10px;
          }
          &.active {
            .text {
              color: #13C2C2;
            }
          }
        }
      }
    }
  </style>
  
  