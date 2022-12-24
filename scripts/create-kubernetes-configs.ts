import yaml from 'js-yaml';
import fs from 'fs';

const pod: any = yaml.load(fs.readFileSync('./kubernetes/scraping-api-agent.yaml', 'utf8'));
const pvc: any = yaml.load(fs.readFileSync('./kubernetes/scraping-api-agent-pvc.yaml', 'utf8'));
const service: any = yaml.load(fs.readFileSync('./kubernetes/scraping-api-agent-service.yaml', 'utf8'));

fs.mkdirSync('./kubernetes/generated');

//surfshark
for (let i = 0; i < 10; i++) {
  const count = i + 1;
  //service
  service.metadata.name = `scraping-api-agent-surfshark-service-${count}`;
  service.spec.selector.app = `scraping-api-agent-surfshark-${count}`;
  fs.writeFileSync(`./kubernetes/generated/scraping-api-agent-surfshark-service-${count}.yaml`, yaml.dump(service));
  //pvc
  pvc.metadata.name = `scraping-api-agent-surfshark-pvc-${count}`;
  fs.writeFileSync(`./kubernetes/generated/scraping-api-agent-surfshark-pvc-${count}.yaml`, yaml.dump(pvc));
  //pod
  pod.metadata.name = `scraping-api-agent-surfshark-${count}`;
  pod.metadata.labels.app = `scraping-api-agent-surfshark-${count}`;
  pod.spec.volumes[0].persistentVolumeClaim.claimName = `scraping-api-agent-surfshark-pvc-${count}`;
  fs.writeFileSync(`./kubernetes/generated/scraping-api-agent-surfshark-${count}.yaml`, yaml.dump(pod));
}


