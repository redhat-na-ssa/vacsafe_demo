Business App Initial Content
=============================

Your project description here.

## QuickStart


1. Create a folder (e.g. nc-vax) and change to the directory

```sh
mkdir nc-vax && cd nc-vax

```

2. Clone the following projects

   - [nc-vax-model](https://gitlab.consulting.redhat.com/nc-vax/nc-vax-model)
   - [nc-vax-kjar](https://gitlab.consulting.redhat.com/nc-vax/nc-vax-kjar)
   - [nc-vax-service](https://gitlab.consulting.redhat.com/nc-vax/nc-vax-service)

```sh
git clone ssh://git@gitlab.consulting.redhat.com:2222/nc-vax/nc-vax-model.git

git clone ssh://git@gitlab.consulting.redhat.com:2222/nc-vax/nc-vax-kjar.git

git clone ssh://git@gitlab.consulting.redhat.com:2222/nc-vax/nc-vax-service.git
```

3. Launch the spring boot application

```sh
cd nc-vax-service
./launch.sh clean install
```

4. Get the server information

**Request**

```sh
# username: user password: user
curl --header 'Authorization: Basic dXNlcjp1c2Vy' http://localhost:8090/rest/server
```

**Response**

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<response type="SUCCESS" msg="Kie Server info">
    <kie-server-info>
        <capabilities>KieServer</capabilities>
        <capabilities>BRM</capabilities>
        <capabilities>BPM</capabilities>
        <capabilities>CaseMgmt</capabilities>
        <capabilities>BPM-UI</capabilities>
        <capabilities>DMN</capabilities>
        <location>http://localhost:8090/rest/server</location>
        <messages>
            <content>Server KieServerInfo{serverId='nc-vax-service', version='7.52.0.Final-redhat-00008', name='nc-vax-service', location='http://localhost:8090/rest/server', capabilities=[KieServer, BRM, BPM, CaseMgmt, BPM-UI, DMN]', messages=null', mode=DEVELOPMENT}started successfully at Wed Aug 18 11:33:56 EDT 2021</content>
            <severity>INFO</severity>
            <timestamp>2021-08-18T11:33:56.046-04:00</timestamp>
        </messages>
        <mode>DEVELOPMENT</mode>
        <name>nc-vax-service</name>
        <id>nc-vax-service</id>
        <version>7.52.0.Final-redhat-00008</version>
    </kie-server-info>
</response>
```
