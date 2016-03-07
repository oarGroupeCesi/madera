define(["backbone",
        "backbone.radio",
        "marionette",
        "jquery",
        "collections/ranges",
        "controllers/objects/projectsObject",
        "controllers/objects/customersObject",
        "controllers/objects/productsObject",
        "controllers/objects/rangesObject",
        "views/projects/projectWrapperLayoutView",
        "views/projects/createProjectView",
        "views/projects/headerProjectView",
        "views/projects/footerProjectView",
        "views/products/createProductView"],
    function (Backbone, Radio, Marionette, $, RangesCollection, ProjectsObject, CustomersObject, ProductsObject, RangesObject, 
            ProjectWrapperLayoutView, CreateProjectView, HeaderProjectView, FooterProjectView, CreateProductView) {
        "use strict";

        var ProjectsController = Marionette.Controller.extend({
            
            addProject : function () {
                App.views.appLayoutView.setBodyClass(['headerEdition', 'creationProjet']);
            
                this.initProject({
                    step : "step1"
                });
            },

            addProductsToProject : function (projectId) {
                App.views.appLayoutView.setBodyClass(['headerEdition', 'creationProduits']);
            
                this.projectId = projectId;

                this.initProject({
                    step : "step2"
                });
            },

            initLayoutAndInitObject : function() {
                App.views.projectWrapperLayoutView = new ProjectWrapperLayoutView();
                App.views.appLayoutView.getRegion('content').show(App.views.projectWrapperLayoutView);

                this.projectsObject = new ProjectsObject();
                this.customersObject = new CustomersObject();
                this.productsObject = new ProductsObject();
                this.rangesObject = new RangesObject();
            },

            initProject : function (options) {
                this.initLayoutAndInitObject();

                if (options.step) {
                    switch(options.step) {
                        case 'step1' : {

                            App.views.headerProjectView = new HeaderProjectView({
                                'title' : 'Etape 1 : Identification du projet'
                            });
                            App.views.projectWrapperLayoutView.getRegion('projectHeader').show(App.views.headerProjectView);
                            App.views.stepView = new CreateProjectView();                            
                            App.views.projectWrapperLayoutView.getRegion('projectContent').show(App.views.stepView);
                            App.views.footerProjectView = new FooterProjectView({
                                'content' : 'Footer du projet : projet'
                            });
                            App.views.projectWrapperLayoutView.getRegion('projectFooter').show(App.views.footerProjectView);
                            
                            break;
                        }
                        
                        case 'step2' : {
                            var that = this;

                            this.rangeChannel = Radio.channel('Ranges');
                            this.rangeChannel
                                .request('getRanges')
                                .then(function (rangesCollection){
                                    that.rangesCollection = new RangesCollection(rangesCollection);
                                    
                                    App.views.headerProjectView = new HeaderProjectView({
                                        'title' : 'Etape 2 : Conception de produit(s)'
                                    });
                                    App.views.projectWrapperLayoutView.getRegion('projectHeader').show(App.views.headerProjectView);
                                    App.views.stepView = new CreateProductView({
                                        'projectId' : that.projectId,
                                        'templateRanges' : that.rangesCollection.getTemplateRanges()
                                    });
                                    App.views.projectWrapperLayoutView.getRegion('projectContent').show(App.views.stepView);
                                    App.views.footerProjectView = new FooterProjectView({
                                        'content' : 'Footer du projet : produits'
                                    });
                                    App.views.projectWrapperLayoutView.getRegion('projectFooter').show(App.views.footerProjectView);

                                });


                            
                            break;
                        }

                        default:
                            break;
                    }
                }
                
            }
        });

        return ProjectsController;
    });