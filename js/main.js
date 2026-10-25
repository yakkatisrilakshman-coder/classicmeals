/* Classic Meals – popular items, menu cards, search and filters. */
var state={cat:"All",q:"",veg:false};

function makeImage(item){
  var im=document.createElement("img");
  im.className="pic";
  im.width=700;im.height=700;
  im.loading="lazy";
  im.alt=item.n;
  im.src="images/menu/"+item.img+".jpg";
  im.onerror=function(){im.onerror=null;im.src="images/hero.svg"};
  return im;
}

function card(it){
  var d=document.createElement("article");d.className="card";
  var b=document.createElement("div");b.className="body";
  var h=document.createElement("h3");
  if(it.v===0||it.v===1){
    var dot=document.createElement("span");
    dot.className="dot "+(it.v?"v":"n");
    dot.setAttribute("role","img");
    dot.setAttribute("aria-label",it.v?"Vegetarian":"Non-vegetarian");
    h.appendChild(dot);
  }
  h.appendChild(document.createTextNode(it.n));
  var p=document.createElement("p");p.textContent=it.d;
  var r=document.createElement("div");r.className="row";
  var pr=document.createElement("span");pr.className="price";pr.textContent="\u20B9"+it.p;
  var t=document.createElement("span");t.className="tag"+(it.a?"":" off");
  t.textContent=it.a?"Available":"Not available today";
  r.appendChild(pr);r.appendChild(t);
  b.appendChild(h);b.appendChild(p);b.appendChild(r);
  d.appendChild(makeImage(it));d.appendChild(b);
  return d;
}

function renderPopular(){
  var g=document.getElementById("popgrid");
  ITEMS.filter(function(x){return x.pop}).slice(0,4).forEach(function(x){g.appendChild(card(x))});
}

function renderMenu(){
  var g=document.getElementById("menugrid");g.textContent="";
  var q=state.q.trim().toLowerCase();
  var list=ITEMS.filter(function(x){
    return (state.cat==="All"||x.c===state.cat)
      &&(!state.veg||x.v===1)
      &&(!q||(x.n+" "+x.d).toLowerCase().indexOf(q)>-1);
  });
  list.forEach(function(x){g.appendChild(card(x))});
  document.getElementById("empty").style.display=list.length?"none":"block";
  document.getElementById("count").textContent=list.length+(list.length===1?" item":" items");
}

function renderChips(){
  var c=document.getElementById("chips");c.textContent="";
  CATS.forEach(function(name){
    var b=document.createElement("button");
    b.type="button";b.className="chip";b.textContent=name;
    b.setAttribute("aria-pressed",name===state.cat?"true":"false");
    b.onclick=function(){state.cat=name;renderChips();renderMenu()};
    c.appendChild(b);
  });
}

if(document.getElementById("popgrid"))renderPopular();
if(document.getElementById("menugrid")){
  document.getElementById("q").addEventListener("input",function(e){state.q=e.target.value;renderMenu()});
  document.getElementById("veg").addEventListener("change",function(e){state.veg=e.target.checked;renderMenu()});
  renderChips();renderMenu();
}

/* Show the drawn placeholder if a static photo (banner, map) is missing. */
document.querySelectorAll("img[data-fallback]").forEach(function(im){
  var fb=im.getAttribute("data-fallback");
  function swap(){im.onerror=null;im.src=fb}
  im.addEventListener("error",swap);
  if(im.complete&&im.naturalWidth===0)swap();
});
