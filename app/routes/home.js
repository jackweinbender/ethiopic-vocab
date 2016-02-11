import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller){
  	$.ajax({
      url:"https://spreadsheets.google.com/feeds/list/1ZeOOv54pyw8yXGFzOGt4EG8dOaAu2MSKG6wSzr768Ag/od6/public/values?alt=json",
      complete: function(response){
        var data = response.responseJSON.feed;
        var roots = data.entry.map(function(item){
        	return {
            root:item.gsx$root.$t,
            ethiopic:item.gsx$ethiopic.$t,
            gloss:item.gsx$gloss.$t,
            morph:item.gsx$morph.$t,
            note:item.gsx$note.$t,
            other:item.gsx$other.$t,
            script:item.gsx$script.$t,
            pos:item.gsx$pos.$t
          };
       }).reduce(function(prev, curr) {
  				prev.push(curr);
          return prev;
        }, []).reduce(function(prev, curr){
          var index = prev.lookup.indexOf(curr.root);
        	if( index === -1){
          	prev.lookup.push(curr.root);
            prev.output.push(newRoot(curr));

            return prev;
            console.log("If")
          }

          prev.output[index].entries.push(curr);
          return prev;
        }, {
        	lookup:[],
          output:[]
        });

        roots = roots.output.sort(function(a, b){

          	for(var i = 0; i <= a.root.length; i++){
              var foo = getRootOrder(a.root[i]);
              var bar = getRootOrder(b.root[i]);
              if(foo == bar){ continue; }
              if(foo < bar){ return -1; }
              return 1;
            }
        }).map(function(root){
        	root.entries.sort(function(a, b){
          	var order = [
              "G",
              "D",
              "L",
              "Q/L",
              "CG",
              "CD",
              "CL",
              "CQ",
              "tG",
              "tD",
              "tL",
              "tQ",
              "tQL",
              "tGL",
              "tCGL",
              'prep',
              'adj',
              'n',
              'adv',
              'other'];
            var foo = order.indexOf(a.pos);
            var bar = order.indexOf(b.pos);
            if(foo < bar){return -1}
            return 1;
          });
          return root;
        });

        var out = {
        	author:data.author,
          title:data.title,
          roots: roots
        }

        //console.log(out);
        controller.set('model', out);
      }
    });
  }
});


function newRoot(item){
	return{
  	root: item.root,
    entries: [item]
  }
}

function getRootOrder(char){
	var order = [
  	"ʾ",
    "ʿ",
    "b",
    "d",
    "ḍ",
    "f",
    "g",
    "gʷ",
    "h",
    "ḥ",
    "k",
    "kʷ",
    "l",
    "m",
    "n",
    "p",
    "ṗ",
    "q",
    "qʷ",
    "r",
    "s",
    "š",
    "ṣ",
    "t",
    "ṭ",
    "w",
    "x",
    "xʷ",
    "y",
    "z"
  ];
  return order.indexOf(char);
}
