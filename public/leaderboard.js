"use strict";(()=>{var a=e=>e>=1e3?(e/1e3).toFixed(1).replace(/\.0$/,"")+"k":String(e),l=["\u{1F947}","\u{1F948}","\u{1F949}"];async function d(){let{users:e,total:r}=await(await fetch("/api/leaderboard")).json();document.getElementById("lb_total").textContent=r?`${r} users so far.`:"";let o=document.getElementById("lb_body");if(!e.length){document.getElementById("lb_empty").hidden=!1;return}e.forEach((t,s)=>{let n=document.createElement("tr"),m=l[s]||String(s+1);n.innerHTML=`<td class="lb-rank">${m}</td>
<td><a class="lb-user" href="https://github.com/${encodeURIComponent(t.username)}" target="_blank" rel="noopener">
<img src="https://github.com/${encodeURIComponent(t.username)}.png?size=48" alt="" loading="lazy">
<span><b></b><small>@${t.username}</small></span></a></td>
<td>${a(t.contributions)}</td><td>${a(t.stars)}</td><td>${t.streak}\u{1F525}</td>`,n.querySelector("b").textContent=t.name||t.username,o.appendChild(n)})}d();})();
