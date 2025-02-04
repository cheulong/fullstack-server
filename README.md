# Fullstack-server

## Step 1: Ansible
### Config Server


In this scenario, we have:

- 3 worker-nodes to host our k8s cluster for fullstack web service

    - worker-node-01 
    - worker-node-02 
    - worker-node-03

This step is to setup and install dependencies to each server via ansible.
Key to take away from this step:
- understand ansible folder structure
- be able to config servers according to tags (worker-node, worker-node-01)

Task1: create ssh key in master node

``` 
ssh-keygen -C "cheulong-pc"
```

Task2: copy ssh key from master to worker node

```
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.10
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.11
ssh-copy-id -i ~/.ssh/k8s_key.pub cheulong@192.168.230.12
```
(optional) create .ssh/config
```
Host worker01
    Hostname 192.168.230.10
    User cheulong

Host worker02
    Hostname 192.168.230.11
    User cheulong

Host worker03
    Hostname 192.168.230.12
    User cheulong
```
test it
```
ssh worker01
```
Task3: install ansible in master node
```
sudo apt update && sudo apt install ansible
```
init the connection between master to worker
```
ansible all --key-file ~/.ssh/k8s_key -i inventory -m ping -u cheulong
```
(optional) create default value with ansible.cfg
```
[defaults]
inventory = inventory
private_key_file = ~/.ssh/k8s_key
remote_user=cheulong
```
test it
```
ansible all -m ping
```

Task4: create ansible playbook
``` 
create-file-playbook.yaml
---

- hosts: all
  tasks:
  - name: Create file.txt
    command: "touch file.txt"

- hosts: worker_01
  tasks:
  - name: Create a.txt
    command: "touch a.txt"

- hosts: worker_02
  tasks:
  - name: Create b.txt
    command: "touch b.txt"

- hosts: worker_03
  tasks:
  - name: Create c.txt
    command: "touch c.txt"

```
run it
```
ansible-playbook create-file-playbook.yaml
```


## Step 2: Setup a cluster
### Install docker
Remove old version
```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
Set up docker 
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
Install docker packages
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
verify
```
sudo docker run hello-world
```
### Config k8s
Install kubeadm, kubelet and kubectl 
```
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

# If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
# sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```
Config cgroup driver 
```
containerd config default | sed 's/SystemdCgroup = false/SystemdCgroup = true/' | sed 's/sandbox_image = "registry.k8s.io\/pause:3.6"/sandbox_image = "registry.k8s.io\/pause:3.9"/' | sudo tee /etc/containerd/config.toml
```
Creating a cluster with kubeadm
```
sudo kubeadm init --apiserver-advertise-address=192.168.1.100 --pod-network-cidr=192.168.0.0/16
```
Configure kubectl
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
Deploy a Pod Network
```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
Add Worker Nodes
```
sudo kubeadm join <master-ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```


## Step 3: Dockerize a simple webapp
### Create reactjs webapp with vite
```
git clone https://github.com/cheulong/fullstack-server.git
cd app
docker-compose up --build
```
docker tag 5735c4dbfcc3 task-list-app/frontend:version0.0.1 
docker image push app-client:version0.0.1  