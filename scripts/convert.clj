(require 'clojure.data.json)

(def file "/home/cfitzhugh/climaid_precip_pct_deltas.geojson")
(def file-contents (slurp file))
(def data (clojure.data.json/read-str file-contents))

(def unsorted
  (reduce (fn [res feature]
          (let [coords (get-in feature ["geometry" "coordinates"])
                timestep (get-in feature ["properties" "timestep"])
                percentile (get-in feature ["properties" "percentile"])
                scenario (get-in feature ["properties" "scenario"])
                value (get-in feature ["properties" "value"])]
            ;(update-in res [timestep scenario percentile] conj [(get coords 1) (get coords 0) value])
            (update-in res [timestep scenario percentile (get coords 1) (get coords 0)] (fn [old]
                                                                                (if old (println (str "ACK, a dupe??!!" old coords value))
                                                                                  value)))
        ))
        {}, (get data "features")))

;(println (pr-str (keys (get-in unsorted ["2020" "85" "mean"]))))

;; Should be 9660 (161 x 60)
;(println (count (get-in unsorted ["2020" "85" "mean"])))


;; Now we want to combine things, so that it's sorted correctly inside a percentile, and is an array in long / lat sorted order.
(def sorted
  (reduce (fn [result [timestep data]]
            (assoc result timestep
                   (reduce (fn [result [scenario data]]
                      (assoc result scenario
                             (reduce (fn [result [percentile data]]
                                ;; Here we are.  The hash {lon : lat : v} needs to become nested array (sorted!)
                                (assoc result percentile (map (fn [[long lats]]
                                                              ;  (println "long: " long " lates: " lats)
                                                              (map (fn [[lat val]]
                                                              ;  (println "lat " lat " val: " val)
                                                                      val
                                                                     ) (sort lats)))
                                                           (sort data)))
                                    ) {} data))
                           ) {} data)))
            {:latitude {:start 35 :step 0.25}
             :longitude {:start -100 :step 0.25}} unsorted))

(spit  "/home/cfitzhugh/working/NYCSCC-map-viewer/climaid_precip.json" (clojure.data.json/write-str sorted))
;(println (pr-str sorted))
