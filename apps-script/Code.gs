/**
 * PM Photo Gallery — Google Apps Script read-only API
 * Deployment: Execute as Me; Who has access: Anyone.
 * The API intentionally exposes photo metadata publicly. Do not use for private albums.
 * No files are created, moved, edited, deleted, or reshared.
 */
const ROOT_ID = '173bPSwiddc338Yj9-tSslwwy6RlXoPX7';
const CALLBACK = 'pmGalleryCallback';
const MAX_PHOTOS = 2500;
const MAX_DEPTH = 8;
const FOLDER_MIME = 'application/vnd.google-apps.folder';
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.callback !== CALLBACK) throw new Error('Invalid callback');
    const level = String(p.level || 'years');
    let data;
    if (level === 'years') {
      const current = Number(Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy')) + 543;
      const allowed = [current, current - 1];
      const root = DriveApp.getFolderById(ROOT_ID);
      const folders = childFolders(root);
      data = allowed.map(year => ({year:year, available:folders.some(f=>parseYear(f.getName())===year)}));
    } else if (level === 'months') {
      const year = validYear(p.year);
      const y = yearFolder(year);
      data = y ? childFolders(y).map(f=>({month:parseMonth(f.getName(),year)})).filter(x=>x.month!==null)
        .filter((x,i,a)=>a.findIndex(v=>v.month===x.month)===i).sort((a,b)=>b.month-a.month) : [];
    } else if (level === 'events') {
      const year=validYear(p.year),month=validMonth(p.month);
      const folder=monthFolder(year,month);
      data=folder?childFolders(folder).map(f=>({id:f.getId(),title:cleanTitle(f.getName()),date:displayDate(f.getName())}))
        .sort((a,b)=>b.title.localeCompare(a.title,'th')):[];
    } else if (level === 'photos') {
      const year=validYear(p.year),month=validMonth(p.month);
      const eventId=String(p.eventId||'');
      if (!/^[a-zA-Z0-9_-]{15,}$/.test(eventId)) throw new Error('Invalid event');
      const folder=monthFolder(year,month);
      if(!folder || !childFolders(folder).some(f=>f.getId()===eventId))throw new Error('Event not found');
      const results=[];const seen={};
      scanPhotos(DriveApp.getFolderById(eventId),results,seen,0);
      data={photos:results,total:results.length,limited:results.length>=MAX_PHOTOS};
    } else {throw new Error('Unknown level')}
    return output({ok:true,level:level,data:data});
  } catch(err) {return output({ok:false,error:String(err.message||err)})}
}
function output(data) {
  // Fixed callback; never interpolate arbitrary executable input.
  return ContentService.createTextOutput(CALLBACK+'('+JSON.stringify(data)+');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function childFolders(folder){const out=[],it=folder.getFolders();while(it.hasNext())out.push(it.next());return out}
function parseYear(name){const m=String(name).match(/(?:25[0-9]{2})/);return m?Number(m[0]):null}
function parseMonth(name,year){const m=String(name).match(/^\s*(25\d{2})-(\d{1,2})\s*$/);if(!m||Number(m[1])!==year)return null;const n=Number(m[2]);return n>=1&&n<=12?n-1:null}
function validYear(value){const y=Number(value),now=Number(Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy'))+543;if(![now,now-1].includes(y))throw new Error('Year not allowed');return y}
function validMonth(value){const m=Number(value);if(!Number.isInteger(m)||m<0||m>11)throw new Error('Invalid month');return m}
function yearFolder(year){const root=DriveApp.getFolderById(ROOT_ID);return childFolders(root).find(f=>parseYear(f.getName())===year)||null}
function monthFolder(year,month){const y=yearFolder(year);return y?childFolders(y).find(f=>parseMonth(f.getName(),year)===month)||null}
function cleanTitle(name){return String(name).replace(/^\s*25\d{2}[-_/]\d{1,2}[-_/]\d{1,2}\s*/,'').trim()||String(name)}
function displayDate(name){const m=String(name).match(/^\s*(25\d{2})-(\d\d?)-(\d\d?)/);return m?m[3]+'/'+m[2]+'/'+m[1]:''}
function scanPhotos(folder,out,seen,depth){
  if(depth>MAX_DEPTH||out.length>=MAX_PHOTOS)return;
  const files=folder.getFiles();
  while(files.hasNext()&&out.length<MAX_PHOTOS){
    const f=files.next(),id=f.getId();
    if(seen[id]||!String(f.getMimeType()).startsWith('image/'))continue;
    seen[id]=true;
    out.push({id:id,name:f.getName()});
  }
  const folders=folder.getFolders();
  while(folders.hasNext()&&out.length<MAX_PHOTOS)scanPhotos(folders.next(),out,seen,depth+1);
}
