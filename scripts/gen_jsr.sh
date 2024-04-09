#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Need version argument."
  exit 1
fi

TOOLS=("zod" "valibot" "types")

declare -A toolImportMap
toolImportMap=([valibot]="jsr:@valibot/valibot@^0.30.0" [zod]="npm:zod@3.22.4")

for tool in "${TOOLS[@]}"; do
  config="{\"name\":\"@open-schemas/$tool\",\"version\":\"$1\",\"exports\":{\"./anthropic\":\"./anthropic/mod.ts\",\"./openai\":\"./openai/mod.ts\"},\"imports\":{\"$tool\":\"${toolImportMap[$tool]}\" }}"
  configFilePath="./$tool/deno.json"

  echo "$config" > "$configFilePath"
  echo "Generated $configFilePath file."
done
