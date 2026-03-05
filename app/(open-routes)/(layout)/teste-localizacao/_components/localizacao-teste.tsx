 "use client"
 
 import { useState } from "react"
 import { Button } from "@/components/ui/button"
 
 export default function LocalizacaoTeste({
   centerLat,
   centerLng,
   radiusMeters = 1000,
 }: {
   centerLat?: number
   centerLng?: number
   radiusMeters?: number
 }) {
   const [locChecking, setLocChecking] = useState(false)
   const [userLat, setUserLat] = useState<number | null>(null)
   const [userLng, setUserLng] = useState<number | null>(null)
   const [distance, setDistance] = useState<number | null>(null)
   const [withinRadius, setWithinRadius] = useState<boolean | null>(null)
   const [locError, setLocError] = useState<string | null>(null)
 
   function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
     const toRad = (v: number) => (v * Math.PI) / 180
     const R = 6371000
     const dLat = toRad(lat2 - lat1)
     const dLon = toRad(lon2 - lon1)
     const a =
       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
     return R * c
   }
 
   async function validateLocation() {
     setLocError(null)
     setLocChecking(true)
     try {
       await new Promise<void>((resolve, reject) => {
         if (!navigator.geolocation) {
           setLocChecking(false)
           setLocError("Dispositivo sem suporte à localização")
           setWithinRadius(false)
           return
         }
         navigator.geolocation.getCurrentPosition(
           (pos) => {
             const lat = pos.coords.latitude
             const lng = pos.coords.longitude
             setUserLat(lat)
             setUserLng(lng)
             if (Number.isFinite(centerLat!) && Number.isFinite(centerLng!)) {
               const dist = distanceMeters(lat, lng, Number(centerLat), Number(centerLng))
               setDistance(dist)
               setWithinRadius(dist <= Number(radiusMeters))
             } else {
               setLocError("Ponto central não configurado")
               setWithinRadius(false)
               setDistance(null)
             }
             resolve()
           },
           (err) => {
             setLocError("Permissão negada ou localização indisponível")
             setWithinRadius(false)
             reject(err)
           },
           { enableHighAccuracy: true, timeout: 10000 }
         )
       })
     } finally {
       setLocChecking(false)
     }
   }
 
   return (
     <div className="space-y-3">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
         <div>
           <p className="text-sm">Clique para permitir e validar sua localização.</p>
           {Number.isFinite(centerLat!) && Number.isFinite(centerLng!) && (
             <p className="text-xs text-muted-foreground">
               Avaliações/testes dentro de {Number(radiusMeters) / 1000} km do ponto central.
             </p>
           )}
         </div>
         <Button type="button" variant="secondary" onClick={validateLocation} disabled={locChecking}>
           {locChecking ? "Validando..." : "Permitir e validar localização"}
         </Button>
       </div>
 
       {locError && <p className="text-sm text-destructive">{locError}</p>}
 
       {userLat !== null && userLng !== null && (
         <div className="rounded-md border p-3">
           <p className="text-sm">Sua posição: {userLat.toFixed(6)}, {userLng.toFixed(6)}</p>
           {distance !== null ? (
             <p className={`text-sm ${withinRadius ? "text-green-700" : "text-yellow-700"}`}>
               Distância até o ponto central: {Math.round(distance)} m
             </p>
           ) : (
             <p className="text-sm text-muted-foreground">Distância indisponível</p>
           )}
         </div>
       )}
     </div>
   )
 }
