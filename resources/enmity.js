// ターゲットしてないときは表示しない
var hideNoTarget = false;

// ロールの定義
var JobRole = {
 PLD: 'TANK',
 WAR: 'TANK',
 GLD: 'TANK',
 MRD: 'TANK',
 DRK: 'TANK',

 CNJ: 'HEALER',
 WHM: 'HEALER',
 SCH: 'HEALER',
 AST: 'HEALER',

 PGL: 'DPS',
 LNC: 'DPS',
 ARC: 'DPS',
 THM: 'DPS',
 MNK: 'DPS',
 DRG: 'DPS',
 BRD: 'DPS',
 BLM: 'DPS',
 ACN: 'DPS',
 SMN: 'DPS',
 ROG: 'DPS',
 NIN: 'DPS',
 MCH: 'DPS',
};

// ターゲットしてないときのダミーデータ
var noTarget = {
  Name: '- none -',
  MaxHP: '--',
  CurrentHP: '--',
  HPPercent: '--',
  Distance: '--',
  EffectiveDistance: '--',
  HorizontalDistance: '--',
}

// フィルタ
Vue.filter('jobclass', function (v) {
 var role = JobRole[v.JobName];
 if (v.isPet) return "Pet";
 if (role != null) return role;
 return "UNKNOWN";
});

Vue.filter('hpcolor', function (t) {
  if (t.HPPercent > 75) return "green";
  if (t.HPPercent > 50) return "yellow";
  if (t.HPPercent > 25) return "orange";
  return "red";
});

Vue.filter('you', function (v) {
  return v.isMe ? "YOU" : v.Name.split(" ")[0];
});

// データ処理
var enmity = new Vue({
  el: '#enmity',
  data: {
    updated: false,
    locked: false,
    collapsed: false,
    target: null,
    entries: null,
    hide: false
  },
  attached: function() {
    document.addEventListener('onOverlayDataUpdate', this.update);
    document.addEventListener('onOverlayStateUpdate', this.updateState);
  },
  detached: function() {
    document.removeEventListener('onOverlayStateUpdate', this.updateState);
    document.removeEventListener('onOverlayDataUpdate', this.update);
  },
  methods: {
    update: function(e) {
      this.updated = true;
      this.entries = e.detail.Enmity.Entries;
      this.target  = e.detail.Enmity.Target ? e.detail.Enmity.Target : noTarget;
      this.hide = (hideNoTarget && e.detail.Enmity.Target == null);
    },
    updateState: function(e) {
      this.locked = e.detail.isLocked;
    },
    toggleCollapse: function() {
      this.collapsed = !this.collapsed;
    },
    enmityDiff: function(entries, index) {
      var ret = "";
      var diff = 0;
      var cls = "";
      if (index > 0) {
        diff = entries[index-1].Enmity - entries[index].Enmity;
        if (index == 1) {
          if (diff < 25000) {
            cls = "class='enmity-alert'";
          } else if (diff < 100000) {
            cls = "class='enmity-warn'";
          }
        }
        ret = "(<span " + cls + ">" + diff + "</span>)";
      }
      return ret;
    },
  }
});
